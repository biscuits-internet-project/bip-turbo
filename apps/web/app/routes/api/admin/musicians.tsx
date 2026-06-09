import { handleAdminCrud } from "~/lib/admin-crud-action";
import { adminAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

// Name-only create (the inline picker's allowCreate) + delete. Full musician
// edits (knownFrom, default instrument) go through the page actions, not here.
export const action = adminAction(async ({ request }) =>
  handleAdminCrud(request, {
    label: "musician",
    create: (name) => services.musicians.create({ name }),
    update: (slug, name) => services.musicians.update(slug, { name }),
    remove: (id) => services.musicians.delete(id),
  }),
);
