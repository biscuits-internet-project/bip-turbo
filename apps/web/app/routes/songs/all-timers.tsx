import { type AllTimersPageView, CacheKeys } from "@bip/domain";
import { ArrowLeft, Flame } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthorSearch } from "~/components/author/author-search";
import { PerformanceTable } from "~/components/performance";
import { SelectFilter } from "~/components/ui/filters";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useYearEraFilter } from "~/hooks/use-year-era-filter";
import { publicLoader } from "~/lib/base-loaders";
import { ERA_OPTIONS, YEAR_OPTIONS } from "~/lib/song-filters";
import { services } from "~/server/services";

export const loader = publicLoader(async (): Promise<AllTimersPageView> => {
  const cacheKey = CacheKeys.songs.allTimers();
  const cacheOptions = { ttl: 3600 };

  return await services.cache.getOrSet(cacheKey, async () => services.songPageComposer.buildAllTimers(), cacheOptions);
});

export function meta() {
  return [{ title: "All-Timers | Songs" }, { name: "description", content: "The best performances across all songs" }];
}

export default function AllTimersPage() {
  const { performances } = useSerializedLoaderData<AllTimersPageView>();
  const [searchParams] = useSearchParams();

  const { selectedYear, handleYearChange, selectedEra, handleEraChange, filterPerformancesByDate } = useYearEraFilter();

  const [coverFilter, setCoverFilter] = useState<"all" | "cover" | "original">(
    (searchParams.get("cover") as "all" | "cover" | "original") || "all",
  );
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(searchParams.get("author") || null);

  const updateCoverAuthorUrl = (cover: string, author: string | null) => {
    const newParams = new URLSearchParams(window.location.search);
    if (cover !== "all") {
      newParams.set("cover", cover);
    } else {
      newParams.delete("cover");
    }
    if (author) {
      newParams.set("author", author);
    } else {
      newParams.delete("author");
    }
    const newUrl = newParams.toString()
      ? `${window.location.pathname}?${newParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  };

  const filteredPerformances = useMemo(() => {
    let result = filterPerformancesByDate(performances);

    if (coverFilter === "cover") {
      result = result.filter((performance) => performance.cover === true);
    } else if (coverFilter === "original") {
      result = result.filter((performance) => performance.cover === false);
    }

    if (selectedAuthor) {
      result = result.filter((performance) => performance.authorId === selectedAuthor);
    }

    return result;
  }, [performances, filterPerformancesByDate, coverFilter, selectedAuthor]);

  const headerContent = (
    <div className="flex items-end flex-wrap gap-x-4 gap-y-3">
      <SelectFilter
        id="year-filter"
        label="Year"
        value={selectedYear}
        onValueChange={handleYearChange}
        options={[{ value: "all", label: "All Years" }, ...YEAR_OPTIONS]}
        width="w-[130px]"
      />
      <SelectFilter
        id="era-filter"
        label="Era"
        value={selectedEra}
        onValueChange={handleEraChange}
        options={[{ value: "all", label: "All Eras" }, ...ERA_OPTIONS]}
        width="w-[170px]"
      />
      <SelectFilter
        id="cover-filter"
        label="Original / Cover"
        value={coverFilter}
        onValueChange={(value) => {
          const newCover = value as "all" | "cover" | "original";
          setCoverFilter(newCover);
          updateCoverAuthorUrl(newCover, selectedAuthor);
        }}
        options={[
          { value: "all", label: "All" },
          { value: "original", label: "Original" },
          { value: "cover", label: "Cover" },
        ]}
        placeholder="Type"
        width="w-[120px]"
      />
      <div className="flex flex-col">
        <label
          htmlFor="author-search"
          className="text-xs font-medium text-content-text-secondary uppercase tracking-wide mb-1.5 h-[18px] flex items-center"
        >
          Author
        </label>
        <AuthorSearch
          value={selectedAuthor}
          onValueChange={(value) => {
            const newAuthor = value === "none" ? null : value;
            setSelectedAuthor(newAuthor);
            updateCoverAuthorUrl(coverFilter, newAuthor);
          }}
          placeholder="All Authors"
          className="w-[150px] sm:w-[200px] h-[42px]"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="h-6 w-6 text-orange-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">All-Timers</h1>
        </div>
      </div>

      <div className="flex justify-start">
        <Link
          to="/songs"
          className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to songs</span>
        </Link>
      </div>

      <PerformanceTable
        performances={filteredPerformances}
        showSongColumn
        headerContent={headerContent}
        excludeFilters={["allTimer"]}
      />
    </div>
  );
}
