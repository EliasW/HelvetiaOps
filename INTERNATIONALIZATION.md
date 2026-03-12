# Internationalization (i18n) Setup

This application uses `next-intl` v4 for internationalization with support for English (en) and German (de).

## Supported Languages

- English (en) - Default
- German (de)

## URL Structure

All routes are prefixed with the locale:
- English: `http://localhost:3000/en/...`
- German: `http://localhost:3000/de/...`

## Adding Translations

Translation files are located in `src/messages/`:
- `src/messages/en.json` - English translations
- `src/messages/de.json` - German translations

### Example Translation Structure

```json
{
  "Home": {
    "title": "Welcome",
    "description": "This is the homepage"
  }
}
```

## Using Translations

### Server Components

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('Home');
  return <h1>{t('title')}</h1>;
}
```

### Client Components

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('Home');
  return <h1>{t('title')}</h1>;
}
```

## Language Switcher

The `LanguageSwitcher` component is available in `src/app/components/LanguageSwitcher.tsx` and can be used to switch between languages.

## Configuration Files

- `src/i18n.ts` - Main i18n configuration
- `middleware.ts` - Handles locale routing
- `next.config.ts` - Next.js configuration with next-intl plugin

## Adding a New Language

1. Create a new translation file: `src/messages/[locale].json`
2. Update `src/i18n.ts` to include the new locale in the validation
3. Update `middleware.ts` to include the new locale in the locales array
4. Update `src/app/[locale]/layout.tsx` to include the new locale in the locales Set
5. Update the `LanguageSwitcher` component to include the new language option
