import { Camera } from "lucide-react";
import { TriStateFilterButton } from "~/components/tri-state-filter-button";
import { cardVariants } from "~/components/ui/card";
import { EXTERNAL_SOURCE_DOMAINS, faviconSrc } from "~/lib/favicon";
import { filterLabelClass } from "~/lib/form-styles";
import {
  canonicalizeFilterParams,
  MEDIA_FILTER_PARAMS,
  type MediaFilterParam,
  parseTriState,
  TRI_STATE_NEXT,
  writeTriState,
} from "~/lib/tri-state-filter";

const FILTER_LABELS: Record<MediaFilterParam, string> = {
  nugs: "Nugs",
  youtube: "YouTube",
  archive: "Archive",
  relisten: "Relisten",
  photos: "Photos",
};

/** Favicon domain per filter — null means "use a lucide icon instead". */
const FILTER_FAVICON_DOMAINS: Record<MediaFilterParam, string | null> = {
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
  /**
   * `card` (default) is the standalone block that sits in a page header corner:
   * its own elevated surface, centered caption, wrapping grid. `inline` drops
   * the surface and lays all five toggles out in one row, so the group reads as
   * another control in a filter bar rather than a panel floating inside it.
   */
  variant?: "card" | "inline";
}

/**
 * Tri-state filter stack for the media/source filters. Each toggle cycles
 * empty → positive → negative → empty so users can express both "must have
 * media X" and "must NOT have media X" in the same URL. Other params
 * (including `q=`) pass through unchanged.
 */
export function ShowFiltersNav({ basePath, currentURLParameters, variant = "card" }: ShowFiltersNavProps) {
  const inline = variant === "inline";
  const buttons = MEDIA_FILTER_PARAMS.map((key) => {
    const state = parseTriState(currentURLParameters.get(key));
    const next = new URLSearchParams(currentURLParameters);
    writeTriState(next, key, TRI_STATE_NEXT[state]);
    // Canonicalized after the toggle so the link is the same string no matter
    // which order the filters were switched on — one edge entry, not several.
    const search = canonicalizeFilterParams(next).toString();

    return (
      <TriStateFilterButton
        key={key}
        state={state}
        label={FILTER_LABELS[key]}
        href={`${basePath}${search ? `?${search}` : ""}`}
        icon={<FilterFavicon filterKey={key} />}
      />
    );
  });

  if (inline) {
    return (
      <div className="flex flex-col">
        <span className={filterLabelClass}>Media</span>
        <div className="flex items-center gap-1">{buttons}</div>
      </div>
    );
  }

  return (
    <div className={cardVariants({ variant: "elevated", className: "rounded-lg px-2 py-2" })}>
      <h2 className="text-[10px] font-semibold text-content-text-tertiary uppercase tracking-wide mb-1.5 text-center">
        Filter by Media
      </h2>
      <div className="grid grid-cols-5 sm:grid-cols-3 gap-1">{buttons}</div>
    </div>
  );
}

function FilterFavicon({ filterKey }: { filterKey: MediaFilterParam }) {
  const domain = FILTER_FAVICON_DOMAINS[filterKey];
  if (domain) {
    return <img src={faviconSrc(domain)} alt="" aria-hidden="true" className="h-3.5 w-3.5" />;
  }
  return <Camera className="h-3.5 w-3.5" aria-hidden="true" />;
}
