import { badRequest, methodNotAllowed } from "~/lib/errors";
import { logger } from "~/lib/logger";

interface CrudEntity {
  id: string;
  name: string;
}

export interface AdminCrudConfig<T extends CrudEntity> {
  /** Lowercase noun used in messages/logs, e.g. "author" or "instrument". */
  label: string;
  create: (name: string) => Promise<T>;
  update: (slug: string, name: string) => Promise<T>;
  remove: (id: string) => Promise<boolean>;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/**
 * Shared POST/PUT/DELETE dispatcher for the admin CRUD endpoints (authors,
 * instruments, …). Kept separate from `createAdminCrudAction` so the branching
 * is testable without the auth wrapper. The service `remove` throws a
 * `"Cannot delete <label> …"` message when the entity is still referenced; that
 * surfaces as a 400 so the client can show the reason.
 */
export async function handleAdminCrud<T extends CrudEntity>(
  request: Request,
  config: AdminCrudConfig<T>,
): Promise<Response> {
  const { label } = config;
  const titleLabel = label.charAt(0).toUpperCase() + label.slice(1);
  const method = request.method;

  try {
    if (method === "POST") {
      const { name } = await request.json();
      if (!name || typeof name !== "string") {
        return badRequest(`${titleLabel} name is required`);
      }
      const entity = await config.create(name);
      logger.info(`Admin created ${label}: ${entity.name} (${entity.id})`);
      return json(entity, 201);
    }

    if (method === "PUT") {
      const { slug, name } = await request.json();
      if (!slug || typeof slug !== "string") {
        return badRequest(`${titleLabel} slug is required`);
      }
      if (!name || typeof name !== "string") {
        return badRequest(`${titleLabel} name is required`);
      }
      const entity = await config.update(slug, name);
      logger.info(`Admin updated ${label}: ${entity.name} (${entity.id})`);
      return json(entity, 200);
    }

    if (method === "DELETE") {
      const { id } = await request.json();
      if (!id || typeof id !== "string") {
        return badRequest(`${titleLabel} ID is required`);
      }
      try {
        const deleted = await config.remove(id);
        if (!deleted) {
          return json({ error: `Failed to delete ${label}` }, 500);
        }
        logger.info(`Admin deleted ${label}: ${id}`);
        return json({ success: true }, 200);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        // The service's in-use guard — report it as a client error, not a 500.
        if (errorMessage.includes(`Cannot delete ${label}`)) {
          return json({ error: errorMessage }, 400);
        }
        throw error;
      }
    }

    return methodNotAllowed();
  } catch (error) {
    logger.error(`Error in admin ${label} endpoint`, { error, method });
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return json({ error: errorMessage }, 500);
  }
}
