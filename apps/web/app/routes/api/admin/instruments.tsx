import { handleAdminCrud } from "~/lib/admin-crud-action";
import { adminAction } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const action = adminAction(async ({ request }) =>
  handleAdminCrud(request, {
    label: "instrument",
    create: (name) => services.instruments.create({ name }),
    update: (slug, name) => services.instruments.update(slug, { name }),
    remove: (id) => services.instruments.delete(id),
  }),
);
