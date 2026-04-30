import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { EXTERNAL_SOURCE_DOMAINS, faviconSrc } from "~/lib/favicon";
import { cn } from "~/lib/utils";

/**
 * The URL param names for the four external-source filters. Values are the
 * literal string `"true"` to match the convention established by
 * {@link FilterNav.parameters}, where presence (not value) drives behavior.
 * Order matches the badge strip in SetlistCard so filter buttons and the
 * per-row indicators read the same way.
 */
const FILTER_KEYS = ["nugs", "youtube", "archive", "photos"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

const FILTER_LABELS: Record<FilterKey, string> = {
  nugs: "Nugs",
  youtube: "YouTube",
  archive: "Archive",
  photos: "Photos",
};

/** Favicon domain per filter — null means "use a lucide icon instead". */
const FILTER_FAVICON_DOMAINS: Record<FilterKey, string | null> = {
  nugs: EXTERNAL_SOURCE_DOMAINS.nugs,
  youtube: EXTERNAL_SOURCE_DOMAINS.youtube,
  archive: EXTERNAL_SOURCE_DOMAINS.archive,
  photos: null,
};

interface ShowFiltersNavProps {
  /** URL the toggles link back to — typically the current year page path. */
  basePath: string;
  /** Current URL's search params; toggles compose on top of these. */
  currentURLParameters: URLSearchParams;
}

/**
 * Compact vertical filter stack for the year route header. Each toggle adds
 * or removes a `nugs|youtube|archive|photos=true` param so the loader can
 * stack them with AND logic. Other params (including `q=`) pass through
 * unchanged. Rendered in the page's top-right so it stays out of the way
 * of the main show list but is always visible for quick filtering.
 */
export function ShowFiltersNav({ basePath, currentURLParameters }: ShowFiltersNavProps) {
  return (
    <div className="card-premium rounded-lg px-2 py-2">
      <h2 className="text-[10px] font-semibold text-content-text-tertiary uppercase tracking-wide mb-1.5 text-center">
        Filter by Media
      </h2>
      <div className="grid grid-cols-2 gap-1">
        {FILTER_KEYS.map((key) => {
          const active = currentURLParameters.has(key);
          const next = new URLSearchParams(currentURLParameters);
          if (active) next.delete(key);
          else next.set(key, "true");
          const search = next.toString();

          return (
            <Link
              key={key}
              to={{ pathname: basePath, search: search ? `?${search}` : "" }}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1.5",
                active
                  ? "text-white bg-content-bg-tertiary border border-brand-primary/50"
                  : "text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white border border-transparent",
              )}
            >
              {FILTER_FAVICON_DOMAINS[key] ? (
                <img
                  src={faviconSrc(FILTER_FAVICON_DOMAINS[key] as string)}
                  alt=""
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              ) : (
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {FILTER_LABELS[key]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
