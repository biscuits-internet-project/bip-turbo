-- Per-user rating display precision (decimal places, 1-4; NULL = app default of 2).
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "rating_decimal_places" INTEGER;
