/**
 * Dark-theme styling for form Input / Textarea controls used in admin
 * and edit forms across the app. Centralized here so a token change
 * (e.g. swapping `--content-bg-secondary` for a different surface)
 * propagates to every form at once instead of needing 17+ edits.
 *
 * Auth forms (login / register / forgot-password) and search inputs use
 * a different visual treatment and should NOT use this constant.
 */
export const formInputClass = "bg-content-bg-secondary border-content-bg-secondary text-content-text-primary";

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
export const listRowClass = "rounded-lg border border-content-bg-secondary bg-content-bg-secondary/50";
