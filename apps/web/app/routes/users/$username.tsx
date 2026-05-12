import { CacheKeys, compareByShowDate } from "@bip/domain";
import { CalendarDays, Edit, MessageSquare, Star, Users } from "lucide-react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { SetlistList } from "~/components/setlist/setlist-list";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PaginationControls } from "~/components/ui/pagination-controls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { type PublicContext, publicLoader } from "~/lib/base-loaders";
import { formatDateLong } from "~/lib/utils";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";

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
      ? await services.ratings.findShowRatingsByUserId(user.id, { skip: ratingsSkip, take: RATINGS_PAGE_SIZE })
      : [];
  const trackRatings =
    activeTab === "track-ratings"
      ? await services.ratings.findTrackRatingsByUserId(user.id, { skip: ratingsSkip, take: RATINGS_PAGE_SIZE })
      : [];

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
  const attendedInitialUserData = await computeShowUserData(
    context,
    attendedSetlists.map((s) => s.show.id),
  );

  return {
    user,
    reviews,
    blogPosts,
    attendedSetlists,
    attendedExternalSources,
    attendedInitialUserData,
    attendedPagination: {
      page: clampedAttendedPage,
      pageSize: ATTENDED_SHOWS_PAGE_SIZE,
      totalPages: totalAttendedPages,
      total: attendanceCount,
    },
    showRatings,
    trackRatings,
    ratingsPagination: {
      page: clampedRatingsPage,
      pageSize: RATINGS_PAGE_SIZE,
      totalPages: ratingsTotalPages,
      total: ratingsTotal,
    },
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
    attendedInitialUserData,
    attendedPagination,
    showRatings,
    trackRatings,
    ratingsPagination,
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
    navigate(`?tab=${activeTab}&page=${nextPage}`, { preventScrollReset: true });
  };

  return (
    <div className="w-full space-y-6">
      {/* Profile Header */}
      <Card className="card-premium">
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
                <Button asChild className="btn-secondary">
                  <Link to="/profile/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
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
        <TabsList className="glass mb-6 hidden sm:flex">
          <TabsTrigger value="shows" asChild>
            <Link
              to="?tab=shows"
              preventScrollReset
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              Shows Attended ({attendanceCount})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="reviews" asChild>
            <Link
              to="?tab=reviews"
              preventScrollReset
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              Reviews ({reviewCount})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="show-ratings" asChild>
            <Link
              to="?tab=show-ratings"
              preventScrollReset
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              Show Ratings ({showRatingsCount})
            </Link>
          </TabsTrigger>
          <TabsTrigger value="track-ratings" asChild>
            <Link
              to="?tab=track-ratings"
              preventScrollReset
              className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
            >
              Song Version Ratings ({trackRatingsCount})
            </Link>
          </TabsTrigger>
          {blogPosts.length > 0 && (
            <TabsTrigger value="blog" asChild>
              <Link
                to="?tab=blog"
                preventScrollReset
                className="data-[state=active]:bg-brand-primary data-[state=active]:text-white"
              >
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
                <Card key={review.id} className="card-premium">
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
                        {review.show.venue.city && review.show.venue.state && (
                          <span>
                            • {review.show.venue.city}, {review.show.venue.state}
                          </span>
                        )}
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
            <Card className="card-premium">
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
          {activeTab === "show-ratings" && ratingsPagination.totalPages > 1 && (
            <PaginationControls
              page={ratingsPagination.page}
              totalPages={ratingsPagination.totalPages}
              total={ratingsPagination.total}
              pageSize={ratingsPagination.pageSize}
              onPageChange={handlePageChange}
            />
          )}
          {showRatings.length > 0 ? (
            <div className="space-y-4">
              {showRatings.map((rating) => (
                <Card key={rating.id} className="card-premium">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {rating.show.slug ? (
                          <Link
                            to={`/shows/${rating.show.slug}`}
                            className="text-brand-primary hover:text-brand-secondary transition-colors hover:underline"
                          >
                            {rating.show.venue?.name || "Unknown Venue"}
                          </Link>
                        ) : (
                          <span className="text-brand-primary">{rating.show.venue?.name || "Unknown Venue"}</span>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-rating-gold fill-rating-gold" />
                          <span className="font-bold text-rating-gold">{rating.value}</span>
                        </div>
                        <span className="text-sm text-content-text-tertiary">
                          {formatDateLong(rating.createdAt.toISOString())}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-content-text-secondary mt-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDateLong(rating.show.date)}</span>
                      {rating.show.venue?.city && rating.show.venue?.state && (
                        <span>
                          • {rating.show.venue.city}, {rating.show.venue.state}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-premium">
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
          {activeTab === "show-ratings" && ratingsPagination.totalPages > 1 && (
            <PaginationControls
              page={ratingsPagination.page}
              totalPages={ratingsPagination.totalPages}
              total={ratingsPagination.total}
              pageSize={ratingsPagination.pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>

        {/* Song Version Ratings Tab */}
        <TabsContent value="track-ratings" className="space-y-4">
          {activeTab === "track-ratings" && ratingsPagination.totalPages > 1 && (
            <PaginationControls
              page={ratingsPagination.page}
              totalPages={ratingsPagination.totalPages}
              total={ratingsPagination.total}
              pageSize={ratingsPagination.pageSize}
              onPageChange={handlePageChange}
            />
          )}
          {trackRatings.length > 0 ? (
            <div className="space-y-4">
              {trackRatings.map((rating) => (
                <Card key={rating.id} className="card-premium">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {rating.track.slug ? (
                          <Link
                            to={`/tracks/${rating.track.slug}`}
                            className="text-brand-primary hover:text-brand-secondary transition-colors hover:underline"
                          >
                            {rating.track.song.title}
                          </Link>
                        ) : (
                          <Link
                            to={`/songs/${rating.track.song.slug}`}
                            className="text-brand-primary hover:text-brand-secondary transition-colors hover:underline"
                          >
                            {rating.track.song.title}
                          </Link>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-rating-gold fill-rating-gold" />
                          <span className="font-bold text-rating-gold">{rating.value}</span>
                        </div>
                        <span className="text-sm text-content-text-tertiary">
                          {formatDateLong(rating.createdAt.toISOString())}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-content-text-secondary mt-1">
                      <span className="bg-content-bg px-2 py-1 rounded text-xs font-medium">
                        Set {rating.track.set} • #{rating.track.position}
                      </span>
                      {rating.track.show.slug ? (
                        <Link to={`/shows/${rating.track.show.slug}`} className="hover:underline">
                          {rating.track.show.venue?.name || "Unknown Venue"} • {formatDateLong(rating.track.show.date)}
                        </Link>
                      ) : (
                        <span>
                          {rating.track.show.venue?.name || "Unknown Venue"} • {formatDateLong(rating.track.show.date)}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="card-premium">
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
          {activeTab === "track-ratings" && ratingsPagination.totalPages > 1 && (
            <PaginationControls
              page={ratingsPagination.page}
              totalPages={ratingsPagination.totalPages}
              total={ratingsPagination.total}
              pageSize={ratingsPagination.pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </TabsContent>

        {/* Blog Posts Tab */}
        <TabsContent value="blog" className="space-y-4">
          {blogPosts.length > 0 ? (
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id} className="card-premium">
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
            <Card className="card-premium">
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
            initialUserData={attendedInitialUserData}
            collapsible
            empty={
              <Card className="card-premium">
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
