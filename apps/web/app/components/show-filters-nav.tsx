import { Camera } from "lucide-react";
import { TriStateFilterButton } from "~/components/tri-state-filter-button";
import { cardVariants } from "~/components/ui/card";
import { EXTERNAL_SOURCE_DOMAINS, faviconSrc } from "~/lib/favicon";
import { parseTriState, TRI_STATE_NEXT, writeTriState } from "~/lib/tri-state-filter";

/**
 * The URL param names for the five media filters. Order matches the badge
 * strip in SetlistCard so filter buttons and the per-row indicators read the
 * same way.
 */
const FILTER_KEYS = ["nugs", "youtube", "archive", "relisten", "photos"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

const FILTER_LABELS: Record<FilterKey, string> = {
  nugs: "Nugs",
  youtube: "YouTube",
  archive: "Archive",
  relisten: "Relisten",
  photos: "Photos",
};

/** Favicon domain per filter — null means "use a lucide icon instead". */
const FILTER_FAVICON_DOMAINS: Record<FilterKey, string | null> = {
  nugs: EXTERNAL_SOURCE_DOMAINS.nugs,
  youtube: EXTERNAL_SOURCE_DOMAINS.youtube,
  archive: EXTERNAL_SOURCE_DOMAINS.archive,
  relisten: EXTERNAL_SOURCE_DOMAINS.relisten,
  photos: null,
};

interface ShowFiltersNavProps {
  /** URL the toggles link back to — typically the current year page path. */
  basePath: string;
  /** Current URL's search params; toggles compose on top of these. */
  currentURLParameters: URLSearchParams;
}

/**
 * Tri-state filter stack for the year route header. Each toggle cycles
 * empty → positive → negative → empty so users can express both "must have
 * media X" and "must NOT have media X" in the same URL. Other params
 * (including `q=`) pass through unchanged.
 */
export function ShowFiltersNav({ basePath, currentURLParameters }: ShowFiltersNavProps) {
  return (
    <div className={cardVariants({ variant: "elevated", className: "rounded-lg px-2 py-2" })}>
      <h2 className="text-[10px] font-semibold text-content-text-tertiary uppercase tracking-wide mb-1.5 text-center">
        Filter by Media
      </h2>
      <div className="grid grid-cols-5 sm:grid-cols-3 gap-1">
        {FILTER_KEYS.map((key) => {
          const state = parseTriState(currentURLParameters.get(key));
          const next = new URLSearchParams(currentURLParameters);
          writeTriState(next, key, TRI_STATE_NEXT[state]);
          const search = next.toString();

          return (
            <TriStateFilterButton
              key={key}
              state={state}
              label={FILTER_LABELS[key]}
              href={`${basePath}${search ? `?${search}` : ""}`}
              icon={<FilterFavicon filterKey={key} />}
            />
          );
        })}
      </div>
    </div>
  );
}

function FilterFavicon({ filterKey }: { filterKey: FilterKey }) {
  const domain = FILTER_FAVICON_DOMAINS[filterKey];
  if (domain) {
    return <img src={faviconSrc(domain)} alt="" aria-hidden="true" className="h-3.5 w-3.5" />;
  }
  return <Camera className="h-3.5 w-3.5" aria-hidden="true" />;
}
