name: project-create-edit-form

description: "Implement a workspace Project Create/Edit form using React Hook Form and Zod validation, with an unsaved changes warning."

# Project Create / Edit Form Skill

## Use when

- you need to build or update a project create/edit page in the HelvetiaOps app
- you want a single shared form implementation for both create and edit modes
- you want validation using Zod and React Hook Form (RHF)
- you want to warn users when they leave with unsaved changes

## Workflow

1. Identify the project form fields and the create vs edit behaviors.
   - Determine required fields, optional fields, and any relation data (teams, users, status).
   - Decide if `edit` mode loads existing project data into the same form.

2. Define a Zod schema for the form data.
   - Use `z.object({...})` for the project payload.
   - Include field validation rules, custom error messages, and transformations as needed.

3. Set up React Hook Form with the Zod resolver.
   - Use `useForm({ resolver: zodResolver(schema), defaultValues })`.
   - Provide `defaultValues` for create mode and existing values for edit mode.

4. Build controlled form fields.
   - Use `register(...)` for inputs, selects, and textareas.
   - Show validation errors next to fields using `formState.errors`.
   - Keep layout consistent with the app's dashboard style.

5. Implement save / submit handling.
   - On submit, call create or update API routes based on mode.
   - Disable the submit button while saving.
   - Show success or validation feedback after save.

6. Add an unsaved changes warning.
   - Track `formState.isDirty` from RHF.
   - Use a browser `beforeunload` listener for page refresh/close.
   - Use a router prompt or modal for in-app navigation away from the form.
   - Confirm with the user before abandoning unsaved changes.

7. Test the form.
   - Verify validation on invalid input.
   - Verify create and edit flows both work.
   - Verify the unsaved changes warning appears only when the form is dirty.

## Quality criteria

- The same form supports both create and edit modes.
- Validation is enforced by Zod and surfaced clearly in the UI.
- Unsaved changes are protected across refresh, close, and route changes.
- UX is consistent with HelvetiaOps dashboard style and accessibility expectations.

## Example prompts

- "Create a project create/edit form with RHF and Zod validation."
- "Add unsaved changes protection to the project form page."
- "Convert the project form to use one shared create/edit component with defaultValues."

## Notes

- Prefer workspace scope, as this is project-specific functionality.
- If the app uses Next.js route transitions, include router-based navigation guarding.
