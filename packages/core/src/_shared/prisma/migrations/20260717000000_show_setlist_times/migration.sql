-- Viewer preference for showing track and set times in the setlist view.
-- Nullable with no default: NULL means the viewer never chose, which the app
-- resolves to on. That keeps "never chose" distinguishable from "opted in",
-- matching show_adjusted_rating / show_rating_compare / color_code_ratings.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "show_setlist_times" BOOLEAN;
