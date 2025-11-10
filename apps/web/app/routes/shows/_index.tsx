import { publicLoader } from "~/lib/base-loaders";

export const loader = publicLoader(async ({ request }): Promise<void> => {
  const url = new URL(request.url);
  const yearParam = url.searchParams.get("year") || new Date().getFullYear();
  const redirectUrl = new URL(`/shows/year/${yearParam}`, url.origin);
  const searchQuery = url.searchParams.get("q");
  if (searchQuery) {
    redirectUrl.searchParams.set("q", searchQuery);
  }
  throw new Response(null, {
    status: 301,
    headers: { Location: redirectUrl.toString() },
  });
});
