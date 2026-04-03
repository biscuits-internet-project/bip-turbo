/**
 * Fetches data from a POST endpoint in batches, merging results.
 *
 * @param url - The endpoint URL
 * @param ids - Array of IDs to fetch
 * @param bodyKey - The key name for the IDs array in the request body (e.g. "showIds", "trackIds")
 * @param batchSize - Max IDs per request
 * @param merge - Function to merge multiple responses into one
 */
export async function batchedPostFetch<T>(
  url: string,
  ids: string[],
  bodyKey: string,
  batchSize: number,
  merge: (results: T[]) => T,
): Promise<T> {
  const fetchBatch = async (batchIds: string[]): Promise<T> => {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [bodyKey]: batchIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}`);
    }

    return response.json();
  };

  if (ids.length <= batchSize) {
    return fetchBatch(ids);
  }

  const batches: string[][] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    batches.push(ids.slice(i, i + batchSize));
  }

  const results = await Promise.all(batches.map(fetchBatch));
  return merge(results);
}
