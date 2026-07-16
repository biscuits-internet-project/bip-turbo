-- Viewer preference for coloring rating values on a purple-to-green scale.
-- Nullable with no default: NULL means the viewer never chose, which the app
-- resolves to on. That keeps "never chose" distinguishable from "opted in",
-- matching show_adjusted_rating / show_rating_compare.
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "color_code_ratings" BOOLEAN;
