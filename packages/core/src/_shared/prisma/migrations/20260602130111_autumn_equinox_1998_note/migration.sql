-- Show note: Jon "Barber" Gutwillig sat in with MMW + Scofield + Charlie Hunter.
UPDATE "shows"
SET "notes" = 'Barber joined John Scofield, John Medeski, Chris Wood, and Charlie Hunter for their encore.', "updated_at" = now()
WHERE "slug" = '1998-09-26-autumn-equinox-festival-wilmer-s-park-brandywine-md'
  AND coalesce("notes", '') = '';
