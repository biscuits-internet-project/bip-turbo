import { SHOWS_STATS_SCOPE, type ShowStatsRow, showsStatsPath } from "@bip/domain";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import type { HeadersArgs, ShouldRevalidateFunction } from "react-router";
import { data } from "react-router";
import { useLocation } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { ShowsStatsTable } from "~/components/show/shows-stats-table";
import { SHOWS_TABLE_PATH, ShowsViewToggle } from "~/components/show/shows-view-toggle";
import { LinkButton } from "~/components/ui/link-button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getShowsMeta } from "~/lib/seo";
import { MEDIA_FILTER_PARAMS } from "~/lib/tri-state-filter";
import { recordCachePolicy, recordUnrecognizedParams } from "~/server/request-counts";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";

interface LoaderData {
  rows: ShowStatsRow[];
  externalSources: Record<string, ShowExternalSources>;
}

/** A day at the edge, for URLs a show edit can name and purge. */
const PURGEABLE_CACHE_CONTROL = "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600";

/** Short enough to self-heal, for URLs no purge reaches. */
const SELF_HEALING_CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=300";

/**
 * The params this table's own controls emit. A URL spelled only with these is
 * one the origin records and a show edit can purge, which is what earns it the
 * long TTL; anything else is left to self-heal so an inbound tracking link can
 * neither go a day stale nor consume the registry's per-scope cap.
 */
const TABLE_PARAMS = new Set([...MEDIA_FILTER_PARAMS, "timeRange", "year", "statsOnly", "attended", "sort", "dir"]);

export const loader = publicLoader(async ({ request }) => {
  const url = new URL(request.url);
  const rows = await services.stats.getShowStatsRows();
  const payload: LoaderData = { rows, externalSources: await computeShowExternalSources(rows) };

  const unrecognized = [...url.searchParams.keys()].filter((key) => !TABLE_PARAMS.has(key));
  const purgeable = unrecognized.length === 0;
  recordCachePolicy("shows/stats", purgeable);
  // Only this route records them: `shows/year` measures 100% purgeable in
  // production, so there is nothing to name there, while a third to half of
  // this route's hits fall to the short TTL for reasons nothing yet reports.
  if (!purgeable) recordUnrecognizedParams("shows/stats", unrecognized);

  // Recorded before the response goes out so the edge entry this request is
  // about to create is already named by the time a show edit purges. The whole
  // catalog renders on every miss, and production logs showed 100% of this
  // route's traffic carrying a query string against a 5-minute TTL — every one
  // of those spellings was returning to the origin 288 times a day.
  if (purgeable) {
    await services.servedUrlRegistry.record(SHOWS_STATS_SCOPE, `${showsStatsPath()}${url.search}`);
  }

  return data(payload, {
    headers: { "Cache-Control": purgeable ? PURGEABLE_CACHE_CONTROL : SELF_HEALING_CACHE_CONTROL },
  });
});

/**
 * Forward the loader's headers verbatim. The policy depends on the request, and
 * React Router's `HeadersArgs` carries no loader data, so it has to be decided
 * in the loader and handed over on its own response.
 */
export function headers({ loaderHeaders }: HeadersArgs): Headers {
  return loaderHeaders;
}

export function meta() {
  return getShowsMeta();
}

/**
 * The payload is the whole catalog and every filter is applied client-side, so
 * a filter change never needs fresh loader data — only a different route does.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({ currentUrl, nextUrl, defaultShouldRevalidate }) => {
  if (currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
};

export default function ShowsStats() {
  const { rows, externalSources } = useSerializedLoaderData<LoaderData>();
  const location = useLocation();
  const currentURLParameters = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Only a plain four-digit range has a cards equivalent — eras and all-time
  // span more than the year route can express.
  const scopedYear = useMemo(() => {
    const timeRange = currentURLParameters.get("timeRange") ?? currentURLParameters.get("year");
    return timeRange && /^\d{4}$/.test(timeRange) ? Number(timeRange) : null;
  }, [currentURLParameters]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="relative">
        <h1 className="page-heading">SHOWS</h1>
        <div className="absolute top-0 right-0 flex items-start gap-3">
          {/* The corner flanks a centered heading, which leaves no room for it
              on a phone — it drops into the flow row below instead. */}
          <div className="hidden sm:block">
            <ShowsViewToggle active="table" currentURLParameters={currentURLParameters} year={scopedYear} />
          </div>
          <AdminOnly>
            <LinkButton to="/shows/new" icon={Plus} iconOnlyOnMobile>
              Create Show
            </LinkButton>
          </AdminOnly>
        </div>
        <div className="mt-3 flex justify-center sm:hidden">
          <ShowsViewToggle active="table" currentURLParameters={currentURLParameters} year={scopedYear} />
        </div>
      </div>

      <ShowsStatsTable rows={rows} externalSources={externalSources} basePath={SHOWS_TABLE_PATH} />
    </div>
  );
}
