import type { Attendance, BlogPost, Rating, Setlist, TourDate } from "@bip/domain";
import { ArrowRight, Calendar, FileText, MapPin, Music, Search } from "lucide-react";
import { Link, redirect } from "react-router-dom";
import { BlogCard } from "~/components/blog/blog-card";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { Card } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface AcastEpisode {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  duration: number;
  mediaUrl: string;
  image: string;
  url: string;
}

interface LoaderData {
  tourDates: TourDate[];
  recentShows: Setlist[];
  recentBlogPosts: Array<BlogPost & { coverImage?: string }>;
  attendancesByShowId: Record<string, Attendance>;
  ratingsByShowId: Record<string, Rating>;
  latestEpisode: AcastEpisode | null;
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

  // Fetch latest podcast episode
  let latestEpisode: AcastEpisode | null = null;
  try {
    const response = await fetch("https://feeder.acast.com/api/v1/shows/d690923d-524e-5c8b-b29f-d66517615b5b?limit=1&from=0");
    const data = await response.json();
    latestEpisode = data.episodes?.[0] || null;
  } catch (error) {
    console.error("Error fetching latest episode:", error);
  }

  return {
    tourDates,
    recentShows,
    recentBlogPosts: recentBlogPostsWithCoverImages,
    attendancesByShowId,
    ratingsByShowId,
    latestEpisode,
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
    latestEpisode,
  } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="w-full p-0">
      {/* Hero section */}
      <div className="py-2 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent font-header">
          Biscuits Internet Project 3.0
        </h1>
        <p className="text-xl text-content-text-secondary mb-8">
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
            <Link to="/shows" className="flex items-center" style={{color: "hsl(var(--brand-tertiary))"}}>
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

        {/* Right Column - Latest Episode, Tour Dates and Blog Posts */}
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
          {/* Latest Podcast Episode */}
          {latestEpisode && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Latest Episode</h2>
                <Link to="/resources/touchdowns" className="flex items-center" style={{color: "hsl(var(--brand-tertiary))"}}>
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="card-premium rounded-lg overflow-hidden">
                {latestEpisode.image && (
                  <div className="relative">
                    <img src={latestEpisode.image} alt={latestEpisode.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-lg font-semibold line-clamp-2">{latestEpisode.title}</h3>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div 
                    className="text-content-text-secondary mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: latestEpisode.description }}
                  />
                  
                  <div className="text-content-text-tertiary text-sm mb-6 space-y-1">
                    <div>Duration: {Math.floor(latestEpisode.duration / 60)} minutes</div>
                    <div>Published: {latestEpisode.publishDate ? new Date(latestEpisode.publishDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Date unavailable'}</div>
                  </div>

                  <div>
                    <a
                      href={latestEpisode.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:text-brand-secondary text-sm font-medium hover:underline transition-colors"
                    >
                      Listen to episode →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Tour Dates Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Upcoming Tour Dates</h2>
              <Link to="/shows/tour-dates" className="flex items-center" style={{color: "hsl(var(--brand-tertiary))"}}>
                View more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {tourDates.length > 0 ? (
              <Card className="card-premium">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-md">
                    <thead>
                      <tr className="text-left text-sm text-content-text-secondary border-b border-glass-border/40">
                        <th className="p-4">Date</th>
                        <th className="p-4">Venue</th>
                        <th className="hidden md:table-cell p-4">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tourDates.map((td: TourDate) => (
                        <tr
                          key={td.formattedStartDate + td.venueName}
                          className="border-b border-glass-border/40 hover:bg-hover-glass"
                        >
                          <td className="p-4 text-content-text-primary">
                            {td.formattedStartDate === td.formattedEndDate
                              ? td.formattedStartDate
                              : `${td.formattedStartDate} - ${td.formattedEndDate}`}
                          </td>
                          <td className="p-4 text-brand-primary font-medium">{td.venueName}</td>
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
              <Link to="/blog" className="flex items-center" style={{color: "hsl(var(--brand-primary))"}}>
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
