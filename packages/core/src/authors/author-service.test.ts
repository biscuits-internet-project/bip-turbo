import { describe, expect, test, vi } from "vitest";
import { AuthorService } from "./author-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

type AuthorRow = { id: string; name: string; slug: string };

// The admin edit route and the admin API both resolve an author by its slug
// (the slug is what's in the URL / request body), so update must look up by
// slug — not id.
function makeAuthorDb(bySlug: Record<string, AuthorRow>) {
  return {
    author: {
      findFirst: vi.fn(({ where }: { where: { slug?: string; id?: { not?: string } } }) => {
        const match = where.slug ? bySlug[where.slug] : null;
        if (!match) return Promise.resolve(null);
        // generateAuthorSlug excludes the current author when checking collisions.
        if (where.id?.not && match.id === where.id.not) return Promise.resolve(null);
        return Promise.resolve(match);
      }),
      update: vi.fn(({ where, data }: { where: { id: string }; data: Record<string, unknown> }) =>
        Promise.resolve({
          id: where.id,
          name: "",
          slug: "",
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2020-01-01"),
          ...data,
        }),
      ),
    },
  };
}

describe("AuthorService.update — resolves by slug", () => {
  test("looks the author up by slug and regenerates the slug on rename", async () => {
    const db = makeAuthorDb({
      "jon-gutwillig": { id: "jg", name: "Jon Gutwillig", slug: "jon-gutwillig" },
    });
    const service = new AuthorService(db as never, logger);

    const result = await service.update("jon-gutwillig", { name: "Jon Gutwillik" });

    expect(db.author.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: "jg" } }));
    expect(result.slug).toBe("jon-gutwillik");
  });

  test("appends a suffix when the renamed slug collides with another author", async () => {
    const db = makeAuthorDb({
      "marc-brownstein": { id: "mb", name: "Marc Brownstein", slug: "marc-brownstein" },
      "aron-magner": { id: "am", name: "Aron Magner", slug: "aron-magner" },
    });
    const service = new AuthorService(db as never, logger);

    const result = await service.update("marc-brownstein", { name: "Aron Magner" });

    expect(result.slug).toBe("aron-magner-2");
  });

  test("throws when no author matches the slug", async () => {
    const db = makeAuthorDb({});
    const service = new AuthorService(db as never, logger);

    await expect(service.update("nobody", { name: "Someone" })).rejects.toThrow('Author with slug "nobody" not found');
  });
});
