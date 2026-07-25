import { type BlogPostWithUser, CacheKeys, type Setlist, type TourDate } from "@bip/domain";
import type { DehydratedState } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogCard } from "~/components/blog/blog-card";
import { CollapsiblePodcastCard, PodcastCard } from "~/components/home/podcast-card";
import { SetlistList } from "~/components/setlist/setlist-list";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { Card, cardVariants } from "~/components/ui/card";
import { DonationBanner } from "~/components/ui/donation-banner";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { isNewPodcastEpisode } from "~/lib/podcast-recency";
import { showUserDataQueryKey } from "~/lib/query-keys";
import { createPrefetchClient, dehydrateAndClear } from "~/lib/query-prefetch";
import { ROCK_OPERA_SLUG, rockOperaPath } from "~/lib/rock-operas";
import { getHomeMeta } from "~/lib/seo";
import { type AcastEpisode, getLatestPodcastEpisode } from "~/server/latest-podcast-episode";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";

interface LoaderData {
  tourDates: TourDate[];
  mobileRecentShows: Setlist[];
  desktopRecentShows: Setlist[];
  recentBlogPosts: Array<BlogPostWithUser>;
  latestEpisode: AcastEpisode | null;
  /** Whether `latestEpisode` is fresh enough to open the mobile podcast card. */
  isNewEpisode: boolean;
  nextTourDate: TourDate | null;
  onThisDayCounts: { showCount: number; allTimerCount: number };
  externalSources: Record<string, ShowExternalSources>;
  dehydratedState: DehydratedState;
}

export const loader = publicLoader<LoaderData>(async ({ context }) => {
  const tourDatesResult = await services.tourDatesService.getTourDates();
  const allTourDates = Array.isArray(tourDatesResult) ? tourDatesResult : [];

  // Find next tour date (first upcoming show)
  const now = new Date();
  const nextTourDate = allTourDates.find((date) => new Date(date.date) >= now) || null;

  // Cache the recent setlists (core show data only - user-specific data
  // handled separately). Light payload: the cards use none of the full
  // Track/song weight (lyrics, histories), and this key is read on every
  // homepage request, so it must stay small. The memo skips re-parsing it
  // per request; admin setlist edits still show immediately (invalidation
  // clears the memo).
  const recentSetlists = await services.cache.getOrSet(
    CacheKeys.home.recentSetlists(15),
    async () => {
      logger.info("Loading recent setlists from DB for home page");
      return await services.setlists.findMany({
        pagination: { limit: 15 },
        sort: [{ field: "date", direction: "desc" }],
      });
    },
    { memoTtlSeconds: 300 },
  );

  logger.info(`Home page setlists loaded: ${recentSetlists.length} shows`);

  // Limit to next 8 upcoming dates for home page
  const tourDates = allTourDates.slice(0, 8);

  // Get recent shows - different amounts for mobile vs desktop
  // We can reuse the cached data from above since it's the same query
  const allRecentShows = recentSetlists;

  // Filter shows: only show past shows or shows within 1 day in the future (for mobile)
  const oneDayFromNow = new Date();
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

  const mobileRecentShows = allRecentShows
    .filter((setlist) => {
      const showDate = new Date(setlist.show.date);
      return showDate <= oneDayFromNow;
    })
    .slice(0, 5); // Take only the last 5 shows after filtering for mobile

  // Desktop gets more shows without filtering
  const desktopRecentShows = allRecentShows.slice(0, 5);

  // Get recent blog posts (last 5)
  const recentBlogPosts = await services.blogPosts.findManyWithUser({
    pagination: { limit: 5 },
    sort: [{ field: "createdAt", direction: "desc" }],
    filters: [
      { field: "state", operator: "eq", value: "published" },
      { field: "publishedAt", operator: "lte", value: new Date() },
    ],
  });

  // Collect every show id rendered on the page so we seed the client's
  // React Query cache with attendance/rating data in one server-side fetch.
  const allShowIds = [
    ...new Set([...mobileRecentShows.map((s) => s.show.id), ...desktopRecentShows.map((s) => s.show.id)]),
  ];

  const queryClient = createPrefetchClient();
  await queryClient.prefetchQuery({
    queryKey: showUserDataQueryKey(allShowIds),
    queryFn: () => computeShowUserData(context, allShowIds),
  });

  const latestEpisode = await getLatestPodcastEpisode();
  const isNewEpisode = latestEpisode ? isNewPodcastEpisode(latestEpisode.publishDate, now) : false;

  const today = new Date();
  const monthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const onThisDayCounts = await services.cache.getOrSet(
    CacheKeys.shows.onThisDayCounts(monthDay),
    async () => ({
      showCount: await services.setlists.countByMonthDay(monthDay),
      allTimerCount: await services.songPageComposer.countAllTimersByMonthDay(monthDay),
    }),
    { ttl: 3600 },
  );

  const shownSetlists = [...desktopRecentShows, ...mobileRecentShows];
  const externalSources = await computeShowExternalSources(
    shownSetlists.map((s) => s.show).filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i),
  );

  return {
    tourDates,
    mobileRecentShows,
    desktopRecentShows,
    recentBlogPosts,
    latestEpisode,
    isNewEpisode,
    nextTourDate,
    onThisDayCounts,
    externalSources,
    dehydratedState: dehydrateAndClear(queryClient),
  };
});

export function meta() {
  return getHomeMeta();
}

export default function Index() {
  const {
    tourDates = [],
    mobileRecentShows = [],
    desktopRecentShows = [],
    recentBlogPosts = [],
    latestEpisode,
    isNewEpisode,
    nextTourDate,
    onThisDayCounts,
    externalSources,
  } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="w-full p-0">
      {/* Hero section */}
      <div className="pt-0 pb-1 text-center mb-2 md:pb-3 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-tron-audiowide tron-outline-brand text-black">
          BISCUITS INTERNET PROJECT 3.0
        </h1>
      </div>

      {/* Donation Banner */}
      <DonationBanner className="mb-4 md:mb-6" />

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Shows */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Recent Shows</h2>
              <div className="flex gap-4">
                <Link
                  to="/shows"
                  className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
                >
                  All Shows →
                </Link>
                {onThisDayCounts.showCount > 0 && (
                  <Link
                    to="/on-this-day"
                    className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
                  >
                    On this day: {onThisDayCounts.showCount} shows, {onThisDayCounts.allTimerCount} all-timers →
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-6">
              <SetlistList
                setlists={desktopRecentShows}
                externalSources={externalSources}
                empty={
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <p className="">No recent shows available</p>
                  </div>
                }
              />
            </div>
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="space-y-8">
            {/* Latest Podcast Episode */}
            {latestEpisode && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Latest Touchdowns All Day Podcast</h3>
                  <Link
                    to="/resources/touchdowns"
                    className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
                  >
                    View all episodes →
                  </Link>
                </div>

                <PodcastCard episode={latestEpisode} />
              </div>
            )}

            {/* Upcoming Tour Dates - Sidebar */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold">Upcoming Tour Dates</h3>
                <Link
                  to="/shows/tour-dates"
                  className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
                >
                  View all tour dates →
                </Link>
              </div>

              {tourDates.length > 0 ? (
                <Card>
                  <div className="relative overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        {tourDates.slice(0, 5).map((td: TourDate) => (
                          <tr key={td.formattedStartDate + td.venueName} className="border-b last:border-b-0">
                            <td className="p-3 text-content-text-primary text-sm">
                              {td.formattedStartDate === td.formattedEndDate
                                ? td.formattedStartDate
                                : `${td.formattedStartDate} - ${td.formattedEndDate}`}
                            </td>
                            <td className="p-3">
                              <div className="text-brand-primary font-medium text-base">{td.venueName}</div>
                              <div className="text-content-text-secondary text-sm">{td.address}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-lg">
                  <p className="text-sm">No upcoming tour dates available</p>
                </div>
              )}
            </div>

            {/* Revolution in Motion */}
            <div>
              <Link to={rockOperaPath(ROCK_OPERA_SLUG.REVOLUTION_IN_MOTION)} className="block group">
                <div className={cardVariants({ variant: "elevated", className: "rounded-lg overflow-hidden" })}>
                  <div className="relative">
                    <img
                      src="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/revolution-in-motion.png"
                      alt="Revolution in Motion"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="text-content-text-secondary text-sm leading-relaxed">
                      A sci-fi concept album following an alien prince whose collision with The Disco Biscuits rewrites
                      the fate of two worlds.
                    </p>
                    <span className="text-brand-primary text-sm font-medium mt-2 inline-block group-hover:text-brand-secondary transition-colors">
                      Explore the story →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Blog Posts */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold">Latest Blog Posts</h3>
                <Link
                  to="/blog"
                  className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
                >
                  View all posts →
                </Link>
              </div>

              {recentBlogPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentBlogPosts.slice(0, 3).map((blogPost) => (
                    <BlogCard key={blogPost.id} blogPost={blogPost} compact={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-lg">
                  <p className="text-sm">No blog posts available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-6">
        {/* The two compact status rows sit tighter to each other than to the
            content sections below, so they read as one block under the hero
            rather than as two more full sections. */}
        <div className="space-y-3">
          {/* Next Show Banner - Mobile */}
          {nextTourDate && (
            <Card>
              <div className="px-4 py-3 text-center">
                {/* Centered, not baseline-aligned: the heading is itself a flex
                    row led by an icon, so its synthesized baseline is the icon's
                    bottom edge rather than the text's, which drops the date. */}
                <div className="flex flex-wrap items-center justify-center gap-x-3">
                  <h3 className="flex items-center gap-1.5 text-sm font-semibold text-brand-primary">
                    <Calendar className="h-4 w-4" />
                    Next Show
                  </h3>
                  <span className="text-base font-bold text-content-text-primary">
                    {nextTourDate.formattedStartDate}
                  </span>
                </div>
                <div className="text-sm text-content-text-secondary">
                  {nextTourDate.venueName} • {nextTourDate.address}
                </div>
              </div>
            </Card>
          )}

          {/* Latest Podcast Episode - Mobile */}
          {latestEpisode && <CollapsiblePodcastCard episode={latestEpisode} isNew={isNewEpisode} />}
        </div>

        {/* Recent Shows Section - Mobile */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Recent Shows</h2>
            <div className="flex gap-4">
              <Link
                to="/shows"
                className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
              >
                All Shows →
              </Link>
              {onThisDayCounts.showCount > 0 && (
                <Link
                  to="/on-this-day"
                  className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
                >
                  On this day: {onThisDayCounts.showCount} shows, {onThisDayCounts.allTimerCount} all-timers →
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <SetlistList
              setlists={mobileRecentShows}
              externalSources={externalSources}
              empty={
                <div className="text-center p-8 border border-dashed rounded-lg">
                  <p className="">No recent shows available</p>
                </div>
              }
            />
          </div>
        </div>

        {/* Upcoming Tour Dates Section - Mobile */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Upcoming Tour Dates</h2>
            <Link
              to="/shows/tour-dates"
              className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors"
            >
              View all tour dates →
            </Link>
          </div>

          {tourDates.length > 0 ? (
            <Card>
              <div className="relative overflow-x-auto">
                <table className="w-full text-md">
                  <thead>
                    <tr className="text-left text-sm text-content-text-secondary border-b">
                      <th className="p-4">Date</th>
                      <th className="p-4">Venue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourDates.map((td: TourDate) => (
                      <tr key={td.formattedStartDate + td.venueName} className="border-b">
                        <td className="p-4 text-content-text-primary">
                          {td.formattedStartDate === td.formattedEndDate
                            ? td.formattedStartDate
                            : `${td.formattedStartDate} - ${td.formattedEndDate}`}
                        </td>
                        <td className="p-4 text-brand-primary font-medium">{td.venueName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="">No upcoming tour dates available</p>
            </div>
          )}
        </div>

        {/* Recent Blog Posts Section - Mobile */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Latest from the Blog</h2>
            <Link to="/blog" className="text-sm text-content-text-tertiary hover:text-brand-primary transition-colors">
              View all blog posts →
            </Link>
          </div>

          {recentBlogPosts.length > 0 ? (
            <div className="grid gap-4">
              {recentBlogPosts.map((blogPost) => (
                <BlogCard key={blogPost.id} blogPost={blogPost} compact={true} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="">No blog posts available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
