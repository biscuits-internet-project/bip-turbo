-- The table was created with a "createdAt" column, but schema.prisma has always
-- mapped the field to "created_at". Nothing reads the column, so the mismatch was
-- silent at runtime, but `prisma migrate dev` saw it as drift and tried to fold a
-- drop-and-recreate into every new migration. Renaming keeps existing values.
-- Idempotent: only renames while the old name is still there.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stats_recompute_requests' AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "stats_recompute_requests" RENAME COLUMN "createdAt" TO "created_at";
  END IF;
END $$;
