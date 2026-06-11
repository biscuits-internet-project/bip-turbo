import { handleAdminCrud } from "~/lib/admin-crud-action";
import { adminAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

// DELETE-only: venues are created/edited via /venues/new and /venues/:slug/edit
// (multi-field forms). This endpoint backs the admin delete button on the
// /venues table; the service refuses venues that still have shows.
export const action = adminAction(async ({ request }) =>
  handleAdminCrud(request, {
    label: "venue",
    remove: (id) => services.venues.delete(id),
  }),
);
