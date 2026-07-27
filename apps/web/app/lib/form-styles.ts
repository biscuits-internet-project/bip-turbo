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
 * The caption above one control in a filter bar. The fixed height keeps every
 * control's label on the same baseline whether its own text wraps or not, so a
 * row of dropdowns, search boxes, and toggle groups stays level.
 */
export const filterLabelClass =
  "text-xs font-medium text-content-text-secondary uppercase tracking-wide mb-1.5 h-[18px] flex items-center";

/**
 * The free-text search box inside a filter bar. Sized to sit level with the
 * compact `<Dropdown size="compact">` triggers beside it, and full-width on
 * phones where the bar stacks. Shared by every table's filter chrome so the
 * search boxes don't drift apart.
 */
export const filterSearchInputClass =
  "w-full sm:w-auto sm:min-w-[250px] sm:max-w-md h-[34px] text-sm border text-white focus-visible:outline-none focus-visible:ring-1 placeholder:text-content-text-tertiary";

/**
 * Surface treatment shared by list rows across the app (track rows,
 * curated-video rows, etc.): a faint dark fill, rounded corners, and a
 * subtle border in the project's secondary-border tone. Padding stays
 * with the caller so denser lists can use `p-2` and content-heavier rows
 * can use `p-3` without forking the shared treatment.
 */
export const listRowClass = "rounded-lg border";
