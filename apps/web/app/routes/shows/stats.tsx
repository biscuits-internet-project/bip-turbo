import type { ShowStatsRow } from "@bip/domain";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import type { ShouldRevalidateFunction } from "react-router";
import { useLocation } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { ShowsStatsTable } from "~/components/show/shows-stats-table";
import { SHOWS_TABLE_PATH, ShowsViewToggle } from "~/components/show/shows-view-toggle";
import { LinkButton } from "~/components/ui/link-button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getShowsMeta } from "~/lib/seo";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";

interface LoaderData {
  rows: ShowStatsRow[];
  externalSources: Record<string, ShowExternalSources>;
}

export const loader = publicLoader(async (): Promise<LoaderData> => {
  const rows = await services.stats.getShowStatsRows();
  return { rows, externalSources: await computeShowExternalSources(rows) };
});

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

export function headers(): Headers {
  // Public and viewer-independent: the per-user half (attendance, own ratings)
  // is fetched separately by the table.
  return new Headers({
    "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
  });
}

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
