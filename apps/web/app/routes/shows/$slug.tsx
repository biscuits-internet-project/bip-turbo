import type { ShowNavItem } from "@bip/core";
import { type ArchiveDotOrgRecording, CacheKeys, type ReviewMinimal, type Setlist, type ShowFile } from "@bip/domain";
import { type DehydratedState, dehydrate } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Link, useRevalidator } from "react-router-dom";
import { toast } from "sonner";
import { AdminOnly } from "~/components/admin/admin-only";
import { ReviewsList } from "~/components/review";
import { ReviewForm } from "~/components/review/review-form";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { SetlistHighlights } from "~/components/setlist/setlist-highlights";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { ArchiveRecordingsCard } from "~/components/show/archive-recordings-card";
import { DebutYearChart } from "~/components/show/debut-year-chart";
import { type ExternalLink, ExternalLinkCard } from "~/components/show/external-link-card";
import { ShowLineupSection } from "~/components/show/show-lineup-section";
import { ShowPhotos } from "~/components/show/show-photos";
import { ShowDate } from "~/components/show-date";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useSession } from "~/hooks/use-session";
import { useSetlistView } from "~/hooks/use-setlist-view";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { EXTERNAL_SOURCE_DOMAINS } from "~/lib/favicon";
import { logger } from "~/lib/logger";
import { MUSICIANS_FEATURE_ENABLED } from "~/lib/musicians-constants";
import { showUserDataQueryKey } from "~/lib/query-keys";
import { createPrefetchClient } from "~/lib/query-prefetch";
import { getShowMeta, getShowStructuredData } from "~/lib/seo";
import { formatDateLong, formatMonthDay } from "~/lib/utils";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";

interface ShowLoaderData {
  setlist: Setlist;
  reviews: ReviewMinimal[];
  archiveRecordings: ArchiveDotOrgRecording[];
  nugsLinks: ExternalLink[];
  relistenLinks: ExternalLink[];
  youtubeLinks: ExternalLink[];
  externalSources: ShowExternalSources;
  photos: ShowFile[];
  adjacentShows: { previous: ShowNavItem | null; next: ShowNavItem | null };
  dehydratedState: DehydratedState;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const loader = publicLoader(async ({ params, context }): Promise<ShowLoaderData> => {
  logger.info("shows.$slug loader", { slug: params.slug });
  const slug = params.slug;
  if (!slug) throw notFound();

  // If the slug is a date, redirect to the first show on that date
  if (DATE_PATTERN.test(slug)) {
    const shows = await services.shows.findByDate(slug);
    if (shows.length === 0) throw notFound();
    throw new Response(null, {
      status: 302,
      headers: { Location: `/shows/${shows[0].slug}` },
    });
  }

  // Cache the setlist data (core show data that's expensive to compute)
  const cacheKey = CacheKeys.show.data(slug);

  const setlist = await services.cache.getOrSet(cacheKey, async () => {
    logger.info(`Loading setlist data from DB for ${slug}`);
    const setlist = await services.setlists.findByShowSlug(slug);
    if (!setlist) throw notFound();
    return setlist;
  });

  // Load reviews, photos, and adjacent shows fresh (not cached - simple queries)
  const [reviews, photos, adjacentShows] = await Promise.all([
    services.reviews.findByShowId(setlist.show.id),
    services.files.findByShowId(setlist.show.id),
    services.shows.findAdjacentShows(setlist.show.date, setlist.show.slug),
  ]);

  logger.info(`Show data loaded for ${slug} - setlist cached, reviews fresh`);

  const [archiveRecordings, nugsReleases, relistenUrl, youtubeVideoUrls, externalSourcesMap] = await Promise.all([
    services.archiveDotOrg.findRecordingsForDate(setlist.show.date),
    services.nugs.findReleasesForDate(setlist.show.date),
    services.relisten.findUrlForDate(setlist.show.date),
    services.youtube.getVideoUrlsForShow(setlist.show.id),
    computeShowExternalSources([setlist.show]),
  ]);

  // Prefetch attendance + user rating + community average for this show
  // so the SetlistCard's badges and the StarRating editor paint on the
  // first server response with no flicker and no client-side POST.
  const showIds = [setlist.show.id];
  const queryClient = createPrefetchClient();
  await queryClient.prefetchQuery({
    queryKey: showUserDataQueryKey(showIds),
    queryFn: () => computeShowUserData(context, showIds),
  });

  const nugsLinks: ExternalLink[] = nugsReleases.map((release) => ({
    url: release.url,
    label: `Listen on nugs.net${release.artistName === "Tractorbeam" ? " (Tractorbeam)" : ""}`,
  }));
  const relistenLinks: ExternalLink[] = relistenUrl ? [{ url: relistenUrl, label: "Listen on Relisten" }] : [];
  const youtubeLinks: ExternalLink[] = youtubeVideoUrls.map((url, i) => ({
    url,
    label: `Watch on YouTube${youtubeVideoUrls.length > 1 ? ` (${i + 1})` : ""}`,
  }));

  return {
    setlist,
    reviews,
    archiveRecordings,
    nugsLinks,
    relistenLinks,
    youtubeLinks,
    externalSources: externalSourcesMap[setlist.show.id] ?? {},
    photos,
    adjacentShows,
    dehydratedState: dehydrate(queryClient),
  };
});

export function meta({ data }: { data: ShowLoaderData }) {
  return getShowMeta(data.setlist);
}

export default function Show() {
  const {
    setlist,
    reviews,
    archiveRecordings,
    nugsLinks,
    relistenLinks,
    youtubeLinks,
    externalSources,
    photos,
    adjacentShows,
  } = useSerializedLoaderData<ShowLoaderData>();
  const { user } = useSession();
  const revalidator = useRevalidator();
  const [setlistView, setSetlistView] = useSetlistView();
  const { userRatingMap, attendanceMap } = useShowUserData([setlist.show.id]);
  const userRating = userRatingMap.get(setlist.show.id) ?? null;
  const userAttendance = attendanceMap.get(setlist.show.id) ?? null;

  const internalUserId = user?.internalUserId ?? undefined;

  const handleReviewSubmit = async (data: { content: string }) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: data.content,
          showId: setlist.show.id,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/auth/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create review");
      }

      toast.success("Review submitted successfully");
      revalidator.revalidate();
    } catch {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleReviewDelete = async (id: string) => {
    try {
      const response = await fetch("/api/reviews", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      toast.success("Review deleted successfully");
      revalidator.revalidate();
    } catch {
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const handleReviewUpdate = async (id: string, content: string) => {
    try {
      const response = await fetch("/api/reviews", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      toast.success("Review updated successfully");
      revalidator.revalidate();
    } catch {
      toast.error("Failed to update review. Please try again.");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getShowStructuredData(setlist),
        }}
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">
          {formatDateLong(setlist.show.date)}
        </h1>
        <AdminOnly>
          <Button variant="outline" size="sm" asChild className="btn-secondary">
            <Link to={`/shows/${setlist.show.slug}/edit`} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit Show</span>
            </Link>
          </Button>
        </AdminOnly>
      </div>

      {/* Navigation */}
      <div className="space-y-2">
        <div className="flex justify-start">
          <Link
            to={`/shows/year/${setlist.show.date.slice(0, 4)}`}
            className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to {setlist.show.date.slice(0, 4)} shows</span>
          </Link>
        </div>
        <div className="flex justify-between items-center gap-2">
          {adjacentShows.previous ? (
            <Link
              to={`/shows/${adjacentShows.previous.slug}${setlistView === "setlist" ? "" : `?view=${setlistView}`}`}
              className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors min-w-0"
            >
              <ChevronLeft className="h-3 w-3 shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">{formatDateLong(adjacentShows.previous.date)}</span>
                <span className="sm:hidden">
                  <ShowDate date={adjacentShows.previous.date} />
                </span>
                {adjacentShows.previous.venueName && (
                  <span className="hidden sm:inline">{` · ${adjacentShows.previous.venueName}`}</span>
                )}
              </span>
            </Link>
          ) : (
            <div />
          )}
          <Link
            to={`/on-this-day/${setlist.show.date.slice(5)}`}
            className="text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors text-center shrink-0"
          >
            <span className="hidden sm:inline">All shows on {formatMonthDay(setlist.show.date.slice(5))} →</span>
            <span className="sm:hidden">{formatMonthDay(setlist.show.date.slice(5))} →</span>
          </Link>
          {adjacentShows.next ? (
            <Link
              to={`/shows/${adjacentShows.next.slug}${setlistView === "setlist" ? "" : `?view=${setlistView}`}`}
              className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors min-w-0 justify-end"
            >
              <span className="truncate">
                <span className="hidden sm:inline">{formatDateLong(adjacentShows.next.date)}</span>
                <span className="sm:hidden">
                  <ShowDate date={adjacentShows.next.date} />
                </span>
                {adjacentShows.next.venueName && (
                  <span className="hidden sm:inline">{` · ${adjacentShows.next.venueName}`}</span>
                )}
              </span>
              <ChevronRight className="h-3 w-3 shrink-0" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Main content area with responsive grid. On mobile we reorder so
          users see the setlist, then external/Archive links + track-note
          highlights, and reviews land at the bottom (long content tail). */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Setlist — always first */}
        <div className="lg:col-span-8">
          <SetlistCard
            key={setlist.show.id}
            setlist={setlist}
            userAttendance={userAttendance}
            userRating={userRating}
            showRating={setlist.show.averageRating}
            externalSources={externalSources}
            defaultView={setlistView}
            onViewChange={setSetlistView}
          />
          {MUSICIANS_FEATURE_ENABLED && <ShowLineupSection lineup={setlist.lineup} />}
          {/* Note when count_for_stats=false (soundchecks, radio sessions,
              cancelled stubs, late-night Tractorbeam sets). Yellow accent on
              the left edge for attention, no full background so it doesn't
              dominate the layout. */}
          {setlist.show.countForStats === false && (
            <p className="mt-3 border-l-2 border-amber-500 pl-3 py-1 text-sm text-content-text-secondary">
              This performance does not count for stats purposes.
            </p>
          )}
        </div>

        {/* Right rail (mobile: sits between setlist and reviews) */}
        <div className="lg:col-span-4 lg:row-span-2">
          <div className="lg:sticky lg:top-4 space-y-2">
            <ExternalLinkCard faviconDomain={EXTERNAL_SOURCE_DOMAINS.nugs} title="Official release" items={nugsLinks} />
            <ExternalLinkCard faviconDomain={EXTERNAL_SOURCE_DOMAINS.youtube} title="Video" items={youtubeLinks} />
            <ArchiveRecordingsCard items={archiveRecordings} />
            <ExternalLinkCard faviconDomain={EXTERNAL_SOURCE_DOMAINS.relisten} title="Relisten" items={relistenLinks} />

            {/* Highlights panel */}
            <SetlistHighlights setlist={setlist} />

            <DebutYearChart setlist={setlist} />
          </div>
        </div>

        {/* Reviews — desktop: under setlist on left column. mobile: below
            right rail since list-of-reviews can be long. */}
        <div className="lg:col-span-8 lg:col-start-1">
          {reviews && reviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-content-text-secondary">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          )}
          {user && internalUserId && !reviews.some((review: ReviewMinimal) => review.userId === internalUserId) && (
            <div className="mb-8">
              <ReviewForm onSubmit={handleReviewSubmit} />
            </div>
          )}
          {reviews && reviews.length > 0 && (
            <ReviewsList
              reviews={reviews}
              currentUserId={internalUserId}
              onDelete={handleReviewDelete}
              onUpdate={handleReviewUpdate}
            />
          )}
        </div>
      </div>

      {/* Photos section at the bottom */}
      {photos.length > 0 && (
        <div className="mt-10 pt-8 border-t border-border/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-content-text-primary">Photos</h2>
            <span className="text-sm text-content-text-tertiary">
              {photos.length} photo{photos.length !== 1 ? "s" : ""}
            </span>
          </div>
          <ShowPhotos photos={photos} />
        </div>
      )}
    </div>
  );
}
