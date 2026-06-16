import type { RatingWithShow, RatingWithTrack, ShowRatingsSort, TrackRatingsSort } from "@bip/core";
import { CacheKeys, compareByShowDate } from "@bip/domain";
import { dehydrate } from "@tanstack/react-query";
import { CalendarDays, Edit, MessageSquare, Star, Users } from "lucide-react";
import { useState } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { formatHalfStep } from "~/components/rating/rating";
import { RatingCharts } from "~/components/rating/rating-charts";
import { formatSetLabel } from "~/components/setlist/set-label";
import { SetlistList } from "~/components/setlist/setlist-list";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LinkButton } from "~/components/ui/link-button";
import { PaginationControls } from "~/components/ui/pagination-controls";
import { SegmentButton } from "~/components/ui/segment-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { UrlSortableHeader } from "~/components/ui/url-sortable-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { type PublicContext, publicLoader } from "~/lib/base-loaders";
import { formatVenueLocation } from "~/lib/format-venue";
import { showUserDataQueryKey } from "~/lib/query-keys";
import { createPrefetchClient } from "~/lib/query-prefetch";
import { formatDateLong, formatDateShort, formatDateShortMobile } from "~/lib/utils";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";

const SHOW_RATINGS_SORTS = ["date", "rating", "modified"] as const satisfies readonly ShowRatingsSort[];
const TRACK_RATINGS_SORTS = [
  "date",
  "set",
  "track",
  "song",
  "rating",
  "modified",
] as const satisfies readonly TrackRatingsSort[];

function parseShowRatingsSort(raw: string | null): ShowRatingsSort {
  return (SHOW_RATINGS_SORTS as readonly string[]).includes(raw ?? "") ? (raw as ShowRatingsSort) : "date";
}

function parseTrackRatingsSort(raw: string | null): TrackRatingsSort {
  return (TRACK_RATINGS_SORTS as readonly string[]).includes(raw ?? "") ? (raw as TrackRatingsSort) : "date";
}

function parseDirection(raw: string | null): "asc" | "desc" {
  return raw === "asc" ? "asc" : "desc";
}

const ATTENDED_SHOWS_PAGE_SIZE = 50;
const RATINGS_PAGE_SIZE = 100;

const TAB_VALUES = ["shows", "reviews", "show-ratings", "track-ratings", "blog"] as const;
type TabValue = (typeof TAB_VALUES)[number];

function parseTab(raw: string | null): TabValue {
  return (TAB_VALUES as readonly string[]).includes(raw ?? "") ? (raw as TabValue) : "shows";
}

async function loadUserProfile({ params, request, context }: LoaderFunctionArgs & { context: PublicContext }) {
  const { username } = params;
  if (!username) {
    throw new Response("Username not provided", { status: 400 });
  }

  const url = new URL(request.url);
  const rawPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageParam = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const activeTab = parseTab(url.searchParams.get("tab"));
  const showRatingsSort = parseShowRatingsSort(url.searchParams.get("sort"));
  const trackRatingsSort = parseTrackRatingsSort(url.searchParams.get("sort"));
  const ratingsDirection = parseDirection(url.searchParams.get("dir"));

  const sessionUser = context.currentUser ?? null;

  // Find the user by username
  const user = await services.users.findByUsername(username);
  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  // Always fetch: counts (drive tab labels) + user stats (header badges) +
  // attendance summary (count + first/last show for header). Only fetch the
  // active tab's row data — heavy users have 7000+ track ratings and
  // shipping all tabs' data on every load costs megabytes.
  const [tabCounts, userStats, profileHeader] = await Promise.all([
    services.users.getUserTabCounts(user.id),
    services.users.getUserStats(user.id),
    services.users.getUserProfileHeader(user.id),
  ]);
  const userStat = userStats[0]; // getUserStats returns an array
  const { attendanceCount, firstShow, lastShow } = profileHeader;

  // Get user's blog posts (simplified - we'll enhance this later)
  // TODO: Implement blog post retrieval
  const blogPosts: Array<{ id: string; slug: string; title: string; content?: string; createdAt?: string | Date }> = [];

  const reviews =
    activeTab === "reviews"
      ? await services.reviews.findByUserIdWithShow(user.id, { sort: [{ field: "createdAt", direction: "desc" }] })
      : [];

  // Pagination state for the rating tabs — shares the `?page=` param with
  // Shows Attended (different totalPages per tab; navigating to a tab via
  // <Link to="?tab=X"> drops the param so page resets to 1).
  const ratingsTotal =
    activeTab === "show-ratings"
      ? tabCounts.showRatingsCount
      : activeTab === "track-ratings"
        ? tabCounts.trackRatingsCount
        : 0;
  const ratingsTotalPages = Math.max(1, Math.ceil(ratingsTotal / RATINGS_PAGE_SIZE));
  const clampedRatingsPage = Math.min(Math.max(1, pageParam), ratingsTotalPages);
  const ratingsSkip = (clampedRatingsPage - 1) * RATINGS_PAGE_SIZE;

  const showRatings =
    activeTab === "show-ratings"
      ? await services.ratings.findShowRatingsByUserId(user.id, {
          skip: ratingsSkip,
          take: RATINGS_PAGE_SIZE,
          sort: showRatingsSort,
          direction: ratingsDirection,
        })
      : [];
  const trackRatings =
    activeTab === "track-ratings"
      ? await services.ratings.findTrackRatingsByUserId(user.id, {
          skip: ratingsSkip,
          take: RATINGS_PAGE_SIZE,
          sort: trackRatingsSort,
          direction: ratingsDirection,
        })
      : [];

  // Aggregate distribution for the active ratings tab's Charts view. Tiny
  // (~250 {year,value,count} rows) vs the paginated table rows, so it ships
  // with the page rather than lazy-loading on toggle.
  const showRatingBuckets =
    activeTab === "show-ratings" ? await services.ratings.getShowRatingDistribution(user.id) : [];
  const trackRatingBuckets =
    activeTab === "track-ratings" ? await services.ratings.getTrackRatingDistribution(user.id) : [];

  const totalRatings = tabCounts.showRatingsCount + tabCounts.trackRatingsCount;

  // Total attended pages comes straight from the count — no full-list fetch
  // needed to derive the page count.
  const totalAttendedPages = Math.max(1, Math.ceil(attendanceCount / ATTENDED_SHOWS_PAGE_SIZE));
  const clampedAttendedPage = Math.min(Math.max(1, pageParam), totalAttendedPages);

  // Only fetch the full attendance list when we actually need to paginate
  // it — i.e. the Shows Attended tab is active. Other tabs (reviews,
  // ratings) don't render any attendances directly, only the header count
  // we already have. Saves ~30-50ms on non-shows tab loads for heavy users.
  const pageShowIds: string[] =
    activeTab === "shows"
      ? await (async () => {
          const userAttendances = await services.attendances.findByUserIdWithShow(user.id, {
            sort: [{ field: "createdAt", direction: "desc" }],
          });
          // Re-sort by show date desc so pages are stable across attendance
          // toggles (mirrors every other SetlistList surface in the app).
          const byShowDateDesc = [...userAttendances].sort((a, b) => -compareByShowDate(a, b));
          const start = (clampedAttendedPage - 1) * ATTENDED_SHOWS_PAGE_SIZE;
          return byShowDateDesc.slice(start, start + ATTENDED_SHOWS_PAGE_SIZE).map((a) => a.show.id);
        })()
      : [];

  const { attendedSetlists, attendedExternalSources } = pageShowIds.length
    ? await services.cache.getOrSet(CacheKeys.users.attendedSetlists(user.id, clampedAttendedPage), async () => {
        const setlists = await services.setlists.findManyByShowIds(pageShowIds);
        const externalSources: Record<string, ShowExternalSources> = await computeShowExternalSources(
          setlists.map((s) => s.show),
        );
        return { attendedSetlists: setlists, attendedExternalSources: externalSources };
      })
    : { attendedSetlists: [], attendedExternalSources: {} as Record<string, ShowExternalSources> };

  // Per-viewer overlay (attendance / rating badges) — not cached; depends on
  // the logged-in user, not the profile being viewed.
  const attendedShowIds = attendedSetlists.map((s) => s.show.id);
  const queryClient = createPrefetchClient();
  await queryClient.prefetchQuery({
    queryKey: showUserDataQueryKey(attendedShowIds),
    queryFn: () => computeShowUserData(context, attendedShowIds),
  });

  return {
    user,
    reviews,
    blogPosts,
    attendedSetlists,
    attendedExternalSources,
    dehydratedState: dehydrate(queryClient),
    attendedPagination: {
      page: clampedAttendedPage,
      pageSize: ATTENDED_SHOWS_PAGE_SIZE,
      totalPages: totalAttendedPages,
      total: attendanceCount,
    },
    showRatings,
    trackRatings,
    showRatingBuckets,
    trackRatingBuckets,
    ratingsPagination: {
      page: clampedRatingsPage,
      pageSize: RATINGS_PAGE_SIZE,
      totalPages: ratingsTotalPages,
      total: ratingsTotal,
    },
    showRatingsSort,
    trackRatingsSort,
    ratingsDirection,
    activeTab,
    attendanceCount,
    reviewCount: tabCounts.reviewCount,
    showRatingsCount: tabCounts.showRatingsCount,
    trackRatingsCount: tabCounts.trackRatingsCount,
    totalRatings,
    userStat,
    firstShow,
    lastShow,
    isOwnProfile: sessionUser?.email === user.email,
  };
}

export type LoaderData = Awaited<ReturnType<typeof loadUserProfile>>;

export const loader = publicLoader<LoaderData>(loadUserProfile);

export const meta: MetaFunction = ({ data }) => {
  const typed = data as LoaderData | undefined;
  if (!typed?.user) {
    return [
      { title: "User Not Found | Biscuits Internet Project" },
      { name: "description", content: "The requested user profile could not be found." },
    ];
  }

  return [
    { title: `${typed.user.username} | Biscuits Internet Project` },
    { name: "description", content: `View ${typed.user.username}'s profile, reviews, and show attendance.` },
  ];
};

export default function UserProfile() {
  const {
    user,
    reviews,
    blogPosts,
    attendedSetlists,
    attendedExternalSources,
    attendedPagination,
    showRatings,
    trackRatings,
    showRatingBuckets,
    trackRatingBuckets,
    ratingsPagination,
    showRatingsSort,
    trackRatingsSort,
    ratingsDirection,
    activeTab,
    attendanceCount,
    reviewCount,
    showRatingsCount,
    trackRatingsCount,
    totalRatings,
    userStat,
    firstShow,
    lastShow,
    isOwnProfile,
  } = useSerializedLoaderData<LoaderData>();

  const navigate = useNavigate();

  // Same handler for every paginated tab — page param is shared across
  // tabs, but we always preserve the active tab so refreshes land back
  // on the right surface. `preventScrollReset` keeps the viewport where
  // the user clicked Next/Prev — otherwise React Router yanks them back
  // to the top of the page on every pagination click.
  const handlePageChange = (nextPage: number) => {
    const sortSuffix =
      activeTab === "show-ratings" || activeTab === "track-ratings"
        ? `&sort=${activeTab === "show-ratings" ? showRatingsSort : trackRatingsSort}&dir=${ratingsDirection}`
        : "";
    navigate(`?tab=${activeTab}&page=${nextPage}${sortSuffix}`, { preventScrollReset: true });
  };

  // Sort changes drop the page back to 1: a sort against page 2 lands the
  // user in the middle of the freshly-ordered list, which is rarely what
  // they want. Both tabs share the handler shape; only the URL fragment
  // changes per tab.
  const handleShowRatingsSortChange = (sort: ShowRatingsSort, direction: "asc" | "desc") => {
    navigate(`?tab=show-ratings&sort=${sort}&dir=${direction}`, { preventScrollReset: true });
  };
  const handleTrackRatingsSortChange = (sort: TrackRatingsSort, direction: "asc" | "desc") => {
    navigate(`?tab=track-ratings&sort=${sort}&dir=${direction}`, { preventScrollReset: true });
  };

  // Table vs. Charts is a per-view client toggle, shared by both ratings
  // tabs — it must not touch the URL or the loader would refetch the table
  // rows on every switch.
  const [ratingsView, setRatingsView] = useState<"table" | "charts">("charts");

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          {/* Top row: Avatar, Name/Score, Badges, Edit Button.
              Mobile stacks (avatar+info on top, badges+edit below); sm+ goes
              side-by-side. */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-6">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Avatar — smaller on mobile so the username fits beside it. */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-glass-bg border-2 border-glass-border flex items-center justify-center flex-shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={`${user.username}'s avatar`} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-content-text-tertiary" />
                )}
              </div>

              {/* User Info */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-content-text-primary break-words">
                    {user.username}
                  </h1>
                  {userStat && (
                    <Badge
                      variant="default"
                      className="bg-brand-primary text-white font-bold text-base sm:text-lg px-3 sm:px-4 py-1 sm:py-2"
                    >
                      {userStat.communityScore || 0}
                    </Badge>
                  )}
                </div>
                <p className="text-sm sm:text-base text-content-text-secondary">
                  Member since {formatDateLong(user.createdAt.toISOString())}
                </p>

                {/* First and Last Show - wrap on narrow screens. */}
                {(firstShow || lastShow) && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mt-2">
                    {firstShow && (
                      <span className="text-content-text-secondary">
                        First show:{" "}
                        <span className="font-medium text-content-text-primary">{formatDateLong(firstShow.date)}</span>
                      </span>
                    )}
                    {lastShow && firstShow?.id !== lastShow?.id && (
                      <span className="text-content-text-secondary">
                        Last show:{" "}
                        <span className="font-medium text-content-text-primary">{formatDateLong(lastShow.date)}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Badges and Edit Button. Aligned left on mobile so
                it reads as a continuation of the user block; right-aligned at sm+. */}
            <div className="flex flex-col items-start sm:items-end gap-3">
              {/* Badges */}
              {userStat?.badges && userStat.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {userStat.badges.slice(0, 4).map((badge) => (
                    <div
                      key={badge.id}
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-full px-3 py-1 text-sm"
                    >
                      <span className="text-sm">{badge.emoji}</span>
                      <span className="text-brand-primary font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Edit Profile Button */}
              {isOwnProfile && (
                <LinkButton to="/profile/edit" icon={Edit} intent="secondary">
                  Edit Profile
                </LinkButton>
              )}
            </div>
          </div>

          {/* Stats Grid — 2-up on mobile so each cell stays readable, 4-up at sm+. */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 p-3 sm:p-4 bg-content-bg/30 rounded-lg border border-content-border/30 mb-4">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-brand-primary">{attendanceCount}</div>
              <div className="text-xs sm:text-sm text-content-text-secondary">Shows Attended</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-brand-secondary">{reviewCount}</div>
              <div className="text-xs sm:text-sm text-content-text-secondary">Reviews Written</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-brand-tertiary">{totalRatings}</div>
              <div className="text-xs sm:text-sm text-content-text-secondary">Total Ratings</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-500">{userStat?.blogPostCount || 0}</div>
              <div className="text-xs sm:text-sm text-content-text-secondary">Blog Posts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs — mobile shows a <select> dropdown (sm:hidden), sm+
          renders the horizontal tab strip. Mirrors the song-detail page so
          the long "Song Version Ratings" label doesn't clip on phones. */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => navigate(`?tab=${value}`, { preventScrollReset: true })}
        className="w-full"
      >
        <div className="sm:hidden mb-4">
          <label htmlFor="user-profile-tab-select" className="sr-only">
            Profile view
          </label>
          <select
            id="user-profile-tab-select"
            value={activeTab}
            onChange={(event) => navigate(`?tab=${event.target.value}`, { preventScrollReset: true })}
            className="w-full h-11 px-3 rounded-md bg-glass-bg border border-glass-border text-content-text-primary focus:outline-none focus:ring-1 focus:ring-ring/20"
          >
            <option value="shows">Shows Attended ({attendanceCount})</option>
            <option value="reviews">Reviews ({reviewCount})</option>
            <option value="show-ratings">Show Ratings ({showRatingsCount})</option>
            <option value="track-ratings">Song Version Ratings ({trackRatingsCount})</option>
            {blogPosts.length > 0 && <option value="blog">Blog Posts ({blogPosts.length})</option>}
          </select>
        </div>
        <TabsList className="mb-6 hidden sm:flex">
          <TabsTrigger value="shows" asChild>
            <Link to="?tab=shows" preventScrollReset>
              Shows Attended ({attendanceCount})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="reviews" asChild>
            <Link to="?tab=reviews" preventScrollReset>
              Reviews ({reviewCount})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="show-ratings" asChild>
            <Link to="?tab=show-ratings" preventScrollReset>
              Show Ratings ({showRatingsCount})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="track-ratings" asChild>
            <Link to="?tab=track-ratings" preventScrollReset>
              Song Version Ratings ({trackRatingsCount})
            </Link>
          </TabsTrigger>
          {blogPosts.length > 0 && (
            <TabsTrigger value="blog" asChild>
              <Link to="?tab=blog" preventScrollReset>
                Blog Posts ({blogPosts.length})
              </Link>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {review.show ? (
                          <Link
                            to={`/shows/${review.show.slug}`}
                            className="text-brand-primary hover:text-brand-secondary transition-colors hover:underline"
                          >
                            {review.show.venue.name}
                          </Link>
                        ) : (
                          <span className="text-brand-primary">Show Review</span>
                        )}
                      </CardTitle>
                      <span className="text-sm text-content-text-tertiary">
                        {formatDateLong(review.createdAt.toISOString())}
                      </span>
                    </div>
                    {review.show && (
                      <div className="flex items-center gap-2 text-sm text-content-text-secondary mt-1">
                        <CalendarDays className="w-4 h-4" />
                        <span>{formatDateLong(review.show.date)}</span>
                        {review.show.venue.city && <span>• {formatVenueLocation(review.show.venue)}</span>}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-content-text-secondary whitespace-pre-wrap">{review.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="w-12 h-12 text-content-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-content-text-primary mb-2">No Reviews Yet</h3>
                <p className="text-content-text-secondary">
                  {isOwnProfile
                    ? "You haven't written any reviews yet. Check out some shows and share your thoughts!"
                    : `${user.username} hasn't written any reviews yet.`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Show Ratings Tab */}
        <TabsContent value="show-ratings" className="space-y-4">
          {showRatings.length > 0 ? (
            <>
              <RatingsViewToggle view={ratingsView} onChange={setRatingsView} label="Show ratings view" />
              {ratingsView === "charts" ? (
                <RatingCharts buckets={showRatingBuckets} kind="show" />
              ) : (
                <>
                  {ratingsPagination.totalPages > 1 && (
                    <PaginationControls
                      page={ratingsPagination.page}
                      totalPages={ratingsPagination.totalPages}
                      total={ratingsPagination.total}
                      pageSize={ratingsPagination.pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                  <div className="w-fit max-w-full mx-auto">
                    <ShowRatingsTable
                      rows={showRatings}
                      sort={showRatingsSort}
                      direction={ratingsDirection}
                      onSort={handleShowRatingsSortChange}
                    />
                  </div>
                  {ratingsPagination.totalPages > 1 && (
                    <PaginationControls
                      page={ratingsPagination.page}
                      totalPages={ratingsPagination.totalPages}
                      total={ratingsPagination.total}
                      pageSize={ratingsPagination.pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="w-12 h-12 text-content-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-content-text-primary mb-2">No Show Ratings Yet</h3>
                <p className="text-content-text-secondary">
                  {isOwnProfile
                    ? "You haven't rated any shows yet. Browse shows and share your thoughts!"
                    : `${user.username} hasn't rated any shows yet.`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Song Version Ratings Tab */}
        <TabsContent value="track-ratings" className="space-y-4">
          {trackRatings.length > 0 ? (
            <>
              <RatingsViewToggle view={ratingsView} onChange={setRatingsView} label="Song version ratings view" />
              {ratingsView === "charts" ? (
                <RatingCharts buckets={trackRatingBuckets} kind="track" />
              ) : (
                <>
                  {ratingsPagination.totalPages > 1 && (
                    <PaginationControls
                      page={ratingsPagination.page}
                      totalPages={ratingsPagination.totalPages}
                      total={ratingsPagination.total}
                      pageSize={ratingsPagination.pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                  <div className="w-fit max-w-full mx-auto">
                    <TrackRatingsTable
                      rows={trackRatings}
                      sort={trackRatingsSort}
                      direction={ratingsDirection}
                      onSort={handleTrackRatingsSortChange}
                    />
                  </div>
                  {ratingsPagination.totalPages > 1 && (
                    <PaginationControls
                      page={ratingsPagination.page}
                      totalPages={ratingsPagination.totalPages}
                      total={ratingsPagination.total}
                      pageSize={ratingsPagination.pageSize}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="w-12 h-12 text-content-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-content-text-primary mb-2">No Song Version Ratings Yet</h3>
                <p className="text-content-text-secondary">
                  {isOwnProfile
                    ? "You haven't rated any song versions yet. Listen to shows and rate individual songs!"
                    : `${user.username} hasn't rated any song versions yet.`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Blog Posts Tab */}
        <TabsContent value="blog" className="space-y-4">
          {blogPosts.length > 0 ? (
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-brand-primary hover:text-brand-secondary transition-colors hover:underline"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <span className="text-sm text-content-text-tertiary">
                        {formatDateLong(
                          post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-content-text-secondary line-clamp-3">
                      {(post.content || "").substring(0, 200)}...
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-brand-primary hover:text-brand-secondary text-sm font-medium mt-3 hover:underline transition-colors"
                    >
                      Read more →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Edit className="w-12 h-12 text-content-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-content-text-primary mb-2">No Blog Posts Yet</h3>
                <p className="text-content-text-secondary">
                  {isOwnProfile
                    ? "You haven't published any blog posts yet. Share your thoughts about shows, music, and more!"
                    : `${user.username} hasn't published any blog posts yet.`}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Shows Attended Tab */}
        <TabsContent value="shows" className="space-y-4">
          {attendedPagination.totalPages > 1 && (
            <PaginationControls
              page={attendedPagination.page}
              totalPages={attendedPagination.totalPages}
              total={attendedPagination.total}
              pageSize={attendedPagination.pageSize}
              onPageChange={handlePageChange}
            />
          )}
          <SetlistList
            setlists={attendedSetlists}
            externalSources={attendedExternalSources}
            collapsible
            empty={
              <Card>
                <CardContent className="py-12 text-center">
                  <CalendarDays className="w-12 h-12 text-content-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-content-text-primary mb-2">No Shows Attended</h3>
                  <p className="text-content-text-secondary">
                    {isOwnProfile
                      ? "You haven't marked any shows as attended yet. Browse shows and mark the ones you've been to!"
                      : `${user.username} hasn't marked any shows as attended yet.`}
                  </p>
                </CardContent>
              </Card>
            }
          />
          {attendedPagination.totalPages > 1 && (
            <PaginationControls
              page={attendedPagination.page}
              totalPages={attendedPagination.totalPages}
              total={attendedPagination.total}
              pageSize={attendedPagination.pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Table/Charts switch shared by both ratings tabs. Centered above the
// content so it reads as a view selector for the whole panel.
function RatingsViewToggle({
  view,
  onChange,
  label,
}: {
  view: "table" | "charts";
  onChange: (view: "table" | "charts") => void;
  label: string;
}) {
  return (
    <div className="flex justify-center">
      <fieldset className="flex border-0 p-0 m-0">
        <legend className="sr-only">{label}</legend>
        <SegmentButton size="md" active={view === "charts"} onClick={() => onChange("charts")}>
          Charts
        </SegmentButton>
        <SegmentButton size="md" active={view === "table"} onClick={() => onChange("table")}>
          Table
        </SegmentButton>
      </fieldset>
    </div>
  );
}

// Modified-date cell: compact M/D/YY on mobile so it fits beside the other
// columns, full "Month D, YYYY" once there's room at sm+.
function ModifiedDate({ createdAt }: { createdAt: Date | string }) {
  const iso = createdAt instanceof Date ? createdAt.toISOString() : createdAt;
  return (
    <>
      <span className="sm:hidden">{formatDateShortMobile(iso)}</span>
      <span className="hidden sm:inline">{formatDateLong(iso)}</span>
    </>
  );
}

function StarValue({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-rating-gold" />
      <span className="font-medium text-xs sm:text-sm text-content-text-primary">{formatHalfStep(value)}</span>
    </span>
  );
}

// Show date cell with venue line below on sm+ viewports. Uses plain media
// queries (not the @container/datecell variant in ShowDate) so the column
// width and the date-format swap don't fight each other inside a table
// with table-layout: auto.
function DateVenueLink({ date, slug, venueLine }: { date: string; slug: string | null; venueLine: string | null }) {
  const body = (
    <>
      <div className="font-medium text-base whitespace-nowrap">
        <span className="sm:hidden">{formatDateShortMobile(date)}</span>
        <span className="hidden sm:inline">{formatDateShort(date)}</span>
      </div>
      {venueLine && (
        <div className="text-xs text-content-text-tertiary mt-0.5 hidden sm:block whitespace-nowrap">{venueLine}</div>
      )}
    </>
  );
  if (!slug) {
    return <div className="text-content-text-secondary">{body}</div>;
  }
  return (
    <Link to={`/shows/${slug}`} className="block text-brand-primary hover:text-brand-secondary">
      {body}
    </Link>
  );
}

const tableCellClass = "px-2 py-2 sm:px-3 sm:py-2.5 align-top border-t border-glass-border/30";
const tableHeadClass = "px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm text-content-text-secondary text-left align-top";

interface ShowRatingsTableProps {
  rows: RatingWithShow[];
  sort: ShowRatingsSort;
  direction: "asc" | "desc";
  onSort: (sort: ShowRatingsSort, direction: "asc" | "desc") => void;
}

function ShowRatingsTable({ rows, sort, direction, onSort }: ShowRatingsTableProps) {
  const header = (sortKey: ShowRatingsSort, label: string, defaultDirection?: "asc" | "desc") => (
    <UrlSortableHeader<ShowRatingsSort>
      sortKey={sortKey}
      label={label}
      currentSort={sort}
      currentDirection={direction}
      defaultDirection={defaultDirection}
      onSortChange={onSort}
    />
  );
  return (
    <div className="w-fit max-w-full overflow-x-auto">
      <table className="table-auto border-collapse text-sm">
        <thead>
          <tr>
            <th className={tableHeadClass}>{header("date", "Show")}</th>
            <th className={tableHeadClass}>{header("rating", "Rating")}</th>
            <th className={tableHeadClass}>{header("modified", "Modified")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const venueLine = row.show.venue?.name
              ? [row.show.venue.name, formatVenueLocation(row.show.venue)].filter(Boolean).join(", ")
              : null;
            return (
              <tr key={row.id} className="hover:bg-hover-glass">
                <td className={tableCellClass}>
                  <DateVenueLink date={row.show.date} slug={row.show.slug} venueLine={venueLine} />
                </td>
                <td className={tableCellClass}>
                  <StarValue value={row.value} />
                </td>
                <td className={`${tableCellClass} text-content-text-tertiary whitespace-nowrap`}>
                  <ModifiedDate createdAt={row.createdAt} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface TrackRatingsTableProps {
  rows: RatingWithTrack[];
  sort: TrackRatingsSort;
  direction: "asc" | "desc";
  onSort: (sort: TrackRatingsSort, direction: "asc" | "desc") => void;
}

function TrackRatingsTable({ rows, sort, direction, onSort }: TrackRatingsTableProps) {
  const header = (sortKey: TrackRatingsSort, label: string, defaultDirection?: "asc" | "desc") => (
    <UrlSortableHeader<TrackRatingsSort>
      sortKey={sortKey}
      label={label}
      currentSort={sort}
      currentDirection={direction}
      defaultDirection={defaultDirection}
      onSortChange={onSort}
    />
  );
  return (
    <div className="w-fit max-w-full overflow-x-auto">
      <table className="table-auto border-collapse text-sm">
        <thead>
          <tr>
            <th className={tableHeadClass}>{header("date", "Show")}</th>
            <th className={`${tableHeadClass} hidden sm:table-cell`}>{header("set", "Set", "asc")}</th>
            <th className={`${tableHeadClass} hidden sm:table-cell`}>{header("track", "#", "asc")}</th>
            <th className={tableHeadClass}>{header("song", "Song", "asc")}</th>
            <th className={tableHeadClass}>{header("rating", "Rating")}</th>
            <th className={tableHeadClass}>{header("modified", "Modified")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-hover-glass">
              <td className={tableCellClass}>
                <DateVenueLink
                  date={row.track.show.date}
                  slug={row.track.show.slug}
                  venueLine={row.track.show.venue?.name ?? null}
                />
              </td>
              <td className={`${tableCellClass} hidden sm:table-cell text-content-text-secondary tabular-nums`}>
                {formatSetLabel(row.track.set, { encoresInSet: row.track.encoresInSet })}
              </td>
              <td className={`${tableCellClass} hidden sm:table-cell text-content-text-secondary tabular-nums`}>
                {row.track.position}
              </td>
              <td className={tableCellClass}>
                <Link
                  to={`/songs/${row.track.song.slug}`}
                  className="text-brand-primary hover:text-brand-secondary font-medium block max-w-[6.5rem] sm:max-w-[14rem] break-words"
                >
                  {row.track.song.title}
                </Link>
              </td>
              <td className={tableCellClass}>
                <StarValue value={row.value} />
              </td>
              <td className={`${tableCellClass} text-content-text-tertiary whitespace-nowrap`}>
                <ModifiedDate createdAt={row.createdAt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
