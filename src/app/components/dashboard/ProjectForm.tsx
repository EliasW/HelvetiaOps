'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';

const projectFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Name is required')
      .max(100, 'Name must be 100 characters or less'),
    description: z
      .string()
      .max(500, 'Description must be 500 characters or less')
      .optional(),
    teamId: z.string().min(1, 'Please choose a team'),
    ownerId: z.string().min(1, 'Please choose an owner'),
    status: z.enum(['active', 'inactive', 'archived']),
    startDate: z
      .string()
      .min(1, 'Please choose a start date')
      .refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid date'),
    endDate: z
      .string()
      .optional()
      .transform((value) => (value?.trim() ? value : undefined)),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (endDate && new Date(endDate) < new Date(startDate)) {
      ctx.addIssue({
        code: 'custom',
        message: 'End date must be on or after the start date',
        path: ['endDate'],
      });
    }
  });

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type TeamOption = {
  id: string;
  name: string;
};

type UserOption = {
  id: string;
  name?: string;
  email: string;
};

type ProjectFormProps = {
  mode: 'create' | 'edit';
  project?: {
    id: string;
    name: string;
    description?: string;
    teamId: string;
    ownerId: string;
    status: 'active' | 'inactive' | 'archived';
    startDate: string;
    endDate?: string;
  };
  teams: TeamOption[];
  users: UserOption[];
};

function useUnsavedChangesWarning(isDirty: boolean, message: string) {
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('/api/')) {
        return;
      }

      if (href.startsWith('/') && !window.confirm(message)) {
        event.preventDefault();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isDirty, message]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handlePopState = () => {
      if (!window.confirm(message)) {
        history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDirty, message]);
}

export default function ProjectForm({ mode, project, teams, users }: ProjectFormProps) {
  const t = useTranslations('ProjectForm');
  const router = useRouter();
  const params = useParams() as { locale: string };
  const basePath = `/${params.locale}/dashboard/projects`;
  const [serverError, setServerError] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const defaultValues = useMemo<ProjectFormValues>(
    () => ({
      name: project?.name ?? '',
      description: project?.description ?? '',
      teamId: project?.teamId ?? '',
      ownerId: project?.ownerId ?? '',
      status: project?.status ?? 'active',
      startDate: project?.startDate ?? new Date().toISOString().slice(0, 10),
      endDate: project?.endDate ?? '',
    }),
    [project]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: 'onTouched',
  });

  useUnsavedChangesWarning(isDirty, t('unsavedChanges'));

  const onSubmit = async (values: ProjectFormValues) => {
    setServerError('');

    const payload = {
      name: values.name,
      description: values.description || undefined,
      teamId: values.teamId,
      ownerId: values.ownerId,
      status: values.status,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
    };

    try {
      const response = await fetch(
        mode === 'create' ? '/api/projects' : `/api/projects/${project?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error?.message ?? 'Failed to save project');
      }

      setIsSaved(true);
      router.push(basePath);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleCancel = () => {
    if (!isDirty || window.confirm(t('unsavedChanges'))) {
      router.push(basePath);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900">
            {mode === 'create' ? t('newTitle') : t('editTitle')}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">{t('descriptionHint')}</p>
        </div>
      </div>

      {(serverError || isSaved) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            serverError ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {serverError || (isSaved ? t(mode === 'create' ? 'successCreate' : 'successEdit') : '')}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-3xl border border-neutral-200 p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-neutral-800">{t('name')}</span>
            <input
              {...register('name')}
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.name && <p className="mt-2 text-xs text-red-600">{String(errors.name.message)}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">{t('team')}</span>
            <select
              {...register('teamId')}
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">{t('team')}</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {errors.teamId && <p className="mt-2 text-xs text-red-600">{String(errors.teamId.message)}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">{t('owner')}</span>
            <select
              {...register('ownerId')}
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">{t('owner')}</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name ?? user.email}
                </option>
              ))}
            </select>
            {errors.ownerId && <p className="mt-2 text-xs text-red-600">{String(errors.ownerId.message)}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">{t('status')}</span>
            <select
              {...register('status')}
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="active">{t('statusActive')}</option>
              <option value="inactive">{t('statusInactive')}</option>
              <option value="archived">{t('statusArchived')}</option>
            </select>
            {errors.status && <p className="mt-2 text-xs text-red-600">{String(errors.status.message)}</p>}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-neutral-800">{t('description')}</span>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-2 w-full rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errors.description && <p className="mt-2 text-xs text-red-600">{String(errors.description.message)}</p>}
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-neutral-800">{t('startDate')}</span>
            <input
              {...register('startDate')}
              type="date"
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.startDate && <p className="mt-2 text-xs text-red-600">{String(errors.startDate.message)}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">{t('endDate')}</span>
            <input
              {...register('endDate')}
              type="date"
              className="mt-2 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.endDate && <p className="mt-2 text-xs text-red-600">{String(errors.endDate.message)}</p>}
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            {t('cancelButton')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {t('saveButton')}
          </button>
        </div>
      </form>
    </div>
  );
}
