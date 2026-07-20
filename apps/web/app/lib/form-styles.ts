/**
 * The single dark-theme surface for form fields (`Input` / `Textarea` /
 * `SelectTrigger`) everywhere a value is entered: admin/edit forms, auth,
 * contact, review, and blog. One surface so a field looks the same in every
 * form and a token change propagates in one edit, instead of the old
 * three-way split (this constant vs. raw `glass-content` vs. the compact-select
 * tokens). The only inputs that stay off it are the compact filter-bar
 * dropdowns (`<Dropdown size="compact">`), which are sized for a filter bar
 * rather than a content form.
 */
export const formInputClass = "text-content-text-primary";

/**
 * The auth form field surface — login, register, and password reset. Auth has
 * its own visual identity (a translucent gradient card with brand borders), so
 * its inputs use the matching frosted-glass `.auth-input` treatment rather than
 * the opaque `formInputClass` used by admin/content forms. One constant so the
 * four auth forms stay identical.
 */
export const authInputClass = "auth-input text-content-text-primary";

/**
 * Block-level label style for native `<label>` elements in forms that
 * don't run through react-hook-form's `<FormLabel>` (which has its own
 * styling layer). Sits above the input on its own line with a tight
 * margin, in the dark-theme secondary-text color.
 */
export const formLabelClass = "block text-sm font-medium text-content-text-secondary mb-1";

/**
 * Surface treatment shared by list rows across the app (track rows,
 * curated-video rows, etc.): a faint dark fill, rounded corners, and a
 * subtle border in the project's secondary-border tone. Padding stays
 * with the caller so denser lists can use `p-2` and content-heavier rows
 * can use `p-3` without forking the shared treatment.
 */
export const listRowClass = "rounded-lg border";
