import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  
  if (!query || query.length < 2) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Use the venue service to search venues
    const venues = await services.venues.findMany({
      filters: [
        {
          field: "name",
          operator: "contains",
          value: query,
        },
      ],
      pagination: {
        limit: 10, // Limit results for performance
      },
      sort: [{ field: "name", direction: "asc" }],
    });

    console.log(`Venue search for "${query}" returned ${venues.length} results`);
    return new Response(JSON.stringify(venues), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Venue search error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage, query }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});