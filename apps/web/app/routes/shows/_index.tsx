import { publicLoader } from "~/lib/base-loaders";

export const loader = publicLoader(async ({ request }): Promise<void> => {
  const url = new URL(request.url);
  const yearParam = url.searchParams.get("year") || new Date().getFullYear();
  const searchQuery = url.searchParams.get("q");
  // Relative, because TLS ends before the app: an absolute URL built from the
  // request origin would send visitors to http://.
  const location = searchQuery
    ? `/shows/year/${yearParam}?${new URLSearchParams({ q: searchQuery })}`
    : `/shows/year/${yearParam}`;
  throw new Response(null, {
    status: 301,
    headers: { Location: location },
  });
});
