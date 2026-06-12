import type { SongAuthor } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AuthorLink, AuthorLinks } from "./author-link";

const author = (overrides: Partial<SongAuthor> = {}): SongAuthor => ({
  id: overrides.id ?? "a-1",
  name: overrides.name ?? "Jon Gutwillig",
  slug: overrides.slug ?? "jon-gutwillig",
  musicianSlug: overrides.musicianSlug,
});

describe("AuthorLink", () => {
  // An author linked to a musician routes to the musician page (its canonical page).
  test("links to the musician page when the author has a musicianSlug", async () => {
    await setupWithRouter(<AuthorLink author={author({ musicianSlug: "jon-gutwillig" })} />);
    expect(screen.getByRole("link", { name: "Jon Gutwillig" })).toHaveAttribute("href", "/musicians/jon-gutwillig");
  });

  // An author with no musician routes to the author page (which lists their songs).
  test("links to the author page when there is no musicianSlug", async () => {
    await setupWithRouter(<AuthorLink author={author({ name: "Robert Hunter", slug: "robert-hunter" })} />);
    expect(screen.getByRole("link", { name: "Robert Hunter" })).toHaveAttribute("href", "/authors/robert-hunter");
  });
});

describe("AuthorLinks", () => {
  // Renders each author as its own link with the right target, comma-separated.
  test("renders every author as a link routed by musician vs author", async () => {
    await setupWithRouter(
      <AuthorLinks
        authors={[
          author({ id: "a-1", name: "Jon Gutwillig", slug: "jon-gutwillig", musicianSlug: "jon-gutwillig" }),
          author({ id: "a-2", name: "Robert Hunter", slug: "robert-hunter" }),
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Jon Gutwillig" })).toHaveAttribute("href", "/musicians/jon-gutwillig");
    expect(screen.getByRole("link", { name: "Robert Hunter" })).toHaveAttribute("href", "/authors/robert-hunter");
  });
});
