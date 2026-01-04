import { CacheKeys, type Attendance, type ReviewMinimal, type Setlist, type ShowFile } from "@bip/domain";
import { ArrowLeft, Edit } from "lucide-react";
import { Link, useRevalidator } from "react-router-dom";
import { toast } from "sonner";
import { AdminOnly } from "~/components/admin/admin-only";
import ArchiveMusicPlayer from "~/components/player";
import { ReviewsList } from "~/components/review";
import { ReviewForm } from "~/components/review/review-form";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { SetlistHighlights } from "~/components/setlist/setlist-highlights";
import { ShowPhotos } from "~/components/show/show-photos";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useSession } from "~/hooks/use-session";
import { type Context, publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { getShowMeta, getShowStructuredData } from "~/lib/seo";
import { logger } from "~/lib/logger";
import { formatDateLong } from "~/lib/utils";
import { services } from "~/server/services";

interface ArchiveItem {
  identifier: string;
  title: string;
  date: string;
  collection?: string[];
  creator?: string;
}

interface ShowLoaderData {
  setlist: Setlist;
  reviews: ReviewMinimal[];
  selectedRecordingId: string | null;
  userAttendance: Attendance | null;
  photos: ShowFile[];
}

async function fetchUserAttendance(context: Context, showId: string): Promise<Attendance | null> {
  if (!context.currentUser) {
    return null;
  }

  try {
    const user = await services.users.findByEmail(context.currentUser.email);
    if (!user) {
      logger.warn(`User not found with email ${context.currentUser.email}`);
      return null;
    }

    const userAttendance = await services.attendances.findByUserIdAndShowId(user.id, showId);
    logger.info(`Fetch user attendance for show ${showId}: attended? ${!!userAttendance}`);
    return userAttendance;
  } catch (error) {
    logger.warn("Failed to load user attendance", { error });
    return null;
  }
}

export const loader = publicLoader(async ({ params, context }): Promise<ShowLoaderData> => {
  logger.info("shows.$slug loader", { slug: params.slug });
  const slug = params.slug;
  if (!slug) throw notFound();

  // Cache the setlist data (core show data that's expensive to compute)
  const cacheKey = CacheKeys.show.data(slug);

  const setlist = await services.cache.getOrSet(cacheKey, async () => {
    logger.info(`Loading setlist data from DB for ${slug}`);
    const setlist = await services.setlists.findByShowSlug(slug);
    if (!setlist) throw notFound();
    return setlist;
  });

  // Load reviews and photos fresh (not cached - infrequent access, simple queries)
  const [reviews, photos] = await Promise.all([
    services.reviews.findByShowId(setlist.show.id),
    services.files.findByShowId(setlist.show.id),
  ]);

  // If user is authenticated, fetch their attendance data for search results
  const userAttendance = await fetchUserAttendance(context, setlist.show.id);

  logger.info(`Show data loaded for ${slug} - setlist cached, reviews fresh`);

  // Find Archive.org recordings for this show date with Redis caching
  let selectedRecordingId: string | null = null;
  const archiveCacheKey = CacheKeys.archive.recordings(setlist.show.date);

  try {
    // Try to get from cache first
    const redis = services.redis;
    const cachedRecordings = await redis.get<ArchiveItem[]>(archiveCacheKey);

    if (cachedRecordings) {
      logger.info(`Archive.org recordings served from Redis cache for ${setlist.show.date}`);
      if (cachedRecordings.length > 0) {
        selectedRecordingId = cachedRecordings[0].identifier;
      }
    } else {
      // Fetch from archive.org if not cached
      const detailsUrl = `https://archive.org/advancedsearch.php?q=collection:DiscoBiscuits AND date:${setlist.show.date}&fl=identifier,title,date&sort=date desc&rows=100&output=json`;

      logger.info("Fetching recording details from archive.org", { detailsUrl });

      const detailsResponse = await fetch(detailsUrl);
      if (!detailsResponse.ok) {
        throw new Error(`Failed to fetch recording details: ${detailsResponse.status}`);
      }

      const detailsData = await detailsResponse.json();
      let archiveRecordings: ArchiveItem[] = [];

      if (detailsData?.response?.docs && detailsData.response.docs.length > 0) {
        archiveRecordings = detailsData.response.docs as ArchiveItem[];

        if (archiveRecordings.length > 0) {
          selectedRecordingId = archiveRecordings[0].identifier;
        }
      }

      // Cache the results with no expiration (permanent cache)
      try {
        await redis.set(archiveCacheKey, archiveRecordings);
        logger.info(`Archive.org recordings cached permanently for ${setlist.show.date}`);
      } catch (error) {
        logger.warn("Failed to cache archive.org recordings", { error });
      }
    }
  } catch (error) {
    logger.error("Error fetching archive.org recordings", { error });
    // Continue without recordings if there's an error
  }

  return { setlist, reviews, selectedRecordingId, userAttendance, photos };
});

export function meta({ data }: { data: ShowLoaderData }) {
  return getShowMeta(data.setlist);
}

export default function Show() {
  const {
    setlist,
    reviews,
    selectedRecordingId,
    userAttendance,
    photos,
  } = useSerializedLoaderData<ShowLoaderData>();
  const { user } = useSession();
  const revalidator = useRevalidator();

  // Get the internal user ID from Supabase metadata
  const internalUserId = user?.user_metadata?.internal_user_id;

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

      {/* Subtle back link */}
      <div className="flex justify-start">
        <Link
          to="/shows"
          className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to shows</span>
        </Link>
      </div>

      {/* Main content area with responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Setlist */}
        <div className="lg:col-span-8">
          <SetlistCard
            key={setlist.show.id}
            setlist={setlist}
            userAttendance={userAttendance}
            userRating={null}
            showRating={setlist.show.averageRating}
          />

          <div className="mt-6">
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

        {/* Right column: Highlights and additional content */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-4 space-y-6">
            {selectedRecordingId && (
              <div>
                <ArchiveMusicPlayer identifier={selectedRecordingId} />
              </div>
            )}

            {/* Highlights panel */}
            <SetlistHighlights setlist={setlist} />
          </div>
        </div>
      </div>

      {/* Photos section at the bottom */}
      {photos.length > 0 && (
        <div className="mt-10 pt-8 border-t border-border/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-content-text-primary">Photos</h2>
            <span className="text-sm text-content-text-tertiary">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
          </div>
          <ShowPhotos photos={photos} />
        </div>
      )}
    </div>
  );
}
