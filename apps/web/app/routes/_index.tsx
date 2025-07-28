import type { Attendance, BlogPost, Rating, Setlist, TourDate } from "@bip/domain";
import { ArrowRight, Calendar, FileText, MapPin, Music, Search } from "lucide-react";
import { Link, redirect } from "react-router-dom";
import { BlogCard } from "~/components/blog/blog-card";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { Card } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  tourDates: TourDate[];
  recentShows: Setlist[];
  recentBlogPosts: Array<BlogPost & { coverImage?: string }>;
  attendancesByShowId: Record<string, Attendance>;
  ratingsByShowId: Record<string, Rating>;
}

export const loader = publicLoader<LoaderData>(async ({ request, context }) => {
  const { currentUser } = context;

  const allTourDates = Array.isArray(await services.tourDatesService.getTourDates())
    ? await services.tourDatesService.getTourDates()
    : [];
  
  // Limit to next 8 upcoming dates for home page
  const tourDates = allTourDates.slice(0, 8);

  // Get recent shows (last 5)
  const recentShows = await services.setlists.findMany({
    pagination: { limit: 5 },
    sort: [{ field: "date", direction: "desc" }],
  });

  // Get recent blog posts (last 5)
  const recentBlogPosts = await services.blogPosts.findMany({
    pagination: { limit: 5 },
    sort: [{ field: "createdAt", direction: "desc" }],
    filters: [
      { field: "state", operator: "eq", value: "published" },
      { field: "publishedAt", operator: "lte", value: new Date() },
    ],
  });

  // Fetch cover images for all blog posts
  const recentBlogPostsWithCoverImages = await Promise.all(
    recentBlogPosts.map(async (blogPost) => {
      const files = await services.files.findByBlogPostId(blogPost.id);
      const coverImage = files.find((file) => file.isCover)?.url;
      return {
        ...blogPost,
        coverImage,
      };
    }),
  );

  const attendances = currentUser
    ? await services.attendances.findManyByUserIdAndShowIds(
        currentUser.id,
        recentShows.map((s) => s.show.id),
      )
    : [];
  const ratings = currentUser
    ? await services.ratings.findManyByUserIdAndRateableIds(
        currentUser.id,
        recentShows.map((s) => s.show.id),
        "Show",
      )
    : [];
  const attendancesByShowId = attendances.reduce(
    (acc, attendance) => {
      acc[attendance.showId] = attendance;
      return acc;
    },
    {} as Record<string, Attendance>,
  );
  const ratingsByShowId = ratings.reduce(
    (acc, rating) => {
      acc[rating.rateableId] = rating;
      return acc;
    },
    {} as Record<string, Rating>,
  );

  return {
    tourDates,
    recentShows,
    recentBlogPosts: recentBlogPostsWithCoverImages,
    attendancesByShowId,
    ratingsByShowId,
  };
});

export function meta() {
  return [
    { title: "Biscuits Internet Project" },
    {
      name: "description",
      content: "The ultimate resource for Disco Biscuits fans - shows, setlists, songs, venues, and more.",
    },
  ];
}

export default function Index() {
  const {
    tourDates = [],
    recentShows = [],
    recentBlogPosts = [],
    attendancesByShowId = {} as Record<string, Attendance>,
    ratingsByShowId = {} as Record<string, Rating>,
  } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="w-full p-0">
      {/* Hero section */}
      <div className="py-2 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-gradient-start via-brand-gradient-mid to-brand-gradient-end bg-clip-text text-transparent font-header">
          Biscuits Internet Project 3.0
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your ultimate resource for the Disco Biscuits - shows, setlists, stats, and more.
        </p>
        {/* <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search shows, songs, venues..."
            className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-lg"
          />
        </div> */}
      </div>

      {/* Main content grid - Setlists and Tour Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mb-16">
        {/* Recent Shows Section - Takes 4/7 of the grid on large screens */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Shows</h2>
            <Link to="/shows" className="text-brand hover:text-hover-accent flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {recentShows.length > 0 ? (
            <div className="grid gap-6">
              {recentShows.map((setlist) => (
                <SetlistCard
                  key={setlist.show.id}
                  setlist={setlist}
                  userAttendance={attendancesByShowId[setlist.show.id] || null}
                  userRating={ratingsByShowId[setlist.show.id] || null}
                  showRating={setlist.show.averageRating}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No recent shows available</p>
            </div>
          )}
        </div>

        {/* Right Column - Tour Dates and Blog Posts */}
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
          {/* Upcoming Tour Dates Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upcoming Tour Dates</h2>
              <Link to="/shows/tour-dates" className="text-brand hover:text-hover-accent flex items-center">
                View more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {tourDates.length > 0 ? (
              <Card className="bg-content-bg border-content-bg-secondary">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-md">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b border-border/40">
                        <th className="p-4">Date</th>
                        <th className="p-4">Venue</th>
                        <th className="hidden md:table-cell p-4">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tourDates.map((td: TourDate) => (
                        <tr
                          key={td.formattedStartDate + td.venueName}
                          className="border-b border-border/40 hover:bg-accent/5"
                        >
                          <td className="p-4 text-white">
                            {td.formattedStartDate === td.formattedEndDate
                              ? td.formattedStartDate
                              : `${td.formattedStartDate} - ${td.formattedEndDate}`}
                          </td>
                          <td className="p-4 text-white font-medium">{td.venueName}</td>
                          <td className="hidden md:table-cell p-4 text-content-text-secondary">{td.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-muted-foreground">No upcoming tour dates available</p>
              </div>
            )}
          </div>

          {/* Recent Blog Posts Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Latest from the Blog</h2>
              <Link to="/blog" className="text-brand hover:text-hover-accent flex items-center">
                View all <ArrowRight className="ml-1 h-4 w-4" />
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
                <p className="text-muted-foreground">No blog posts available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
