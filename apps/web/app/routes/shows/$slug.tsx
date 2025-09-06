import { CacheKeys, type Attendance, type ReviewMinimal, type Setlist } from "@bip/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AdminOnly } from "~/components/admin/admin-only";
import ArchiveMusicPlayer from "~/components/player";
import { ReviewsList } from "~/components/review";
import { ReviewForm } from "~/components/review/review-form";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { SetlistHighlights } from "~/components/setlist/setlist-highlights";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useSession } from "~/hooks/use-session";
import { fetchUserAttendance } from "~/lib/fetch-utils";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { getShowMeta, getShowStructuredData } from "~/lib/seo";
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
}


export const loader = publicLoader(async ({ params, context }): Promise<ShowLoaderData> => {
  console.log("⚡️ shows.$slug loader:", params.slug);
  const slug = params.slug;
  if (!slug) throw notFound();

  // Cache the setlist data (core show data that's expensive to compute)
  const cacheKey = CacheKeys.show.data(slug);

  const setlist = await services.cache.getOrSet(
    cacheKey,
    async () => {
      console.log(`📀 Loading setlist data from DB for ${slug}`);
      const setlist = await services.setlists.findByShowSlug(slug);
      if (!setlist) throw notFound();
      return setlist;
    }
  );

  // Load reviews fresh (not cached - infrequent access, simple query)
  const reviews = await services.reviews.findByShowId(setlist.show.id);

  // If user is authenticated, fetch their attendance for this show
  const userAttendance = await fetchUserAttendance(context.currentUser, setlist.show.id);

  console.log(`🎯 Show data loaded for ${slug} - setlist cached, reviews fresh`);

  // Find Archive.org recordings for this show date with Redis caching
  let selectedRecordingId: string | null = null;
  const archiveCacheKey = CacheKeys.archive.recordings(setlist.show.date);

  try {
    // Try to get from cache first
    const redis = services.redis;
    const cachedRecordings = await redis.get<ArchiveItem[]>(archiveCacheKey);

    if (cachedRecordings) {
      console.log(`Archive.org recordings served from Redis cache for ${setlist.show.date}`);
      if (cachedRecordings.length > 0) {
        selectedRecordingId = cachedRecordings[0].identifier;
      }
    } else {
      // Fetch from archive.org if not cached
      const detailsUrl = `https://archive.org/advancedsearch.php?q=collection:DiscoBiscuits AND date:${setlist.show.date}&fl=identifier,title,date&sort=date desc&rows=100&output=json`;

      console.log("Fetching recording details from archive.org:", detailsUrl);

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
        console.log(`Archive.org recordings cached permanently for ${setlist.show.date}`);
      } catch (error) {
        console.warn("Failed to cache archive.org recordings:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching archive.org recordings:", error);
    // Continue without recordings if there's an error
  }

  return { setlist, reviews, selectedRecordingId, userAttendance };
});

export function meta({ data }: { data: ShowLoaderData }) {
  return getShowMeta(data.setlist);
}

export default function Show() {
  const { setlist, reviews: initialReviews, selectedRecordingId, userAttendance } = useSerializedLoaderData<ShowLoaderData>();
  const { user } = useSession();
  const queryClient = useQueryClient();

  // Get the internal user ID from Supabase metadata
  const internalUserId = user?.user_metadata?.internal_user_id;

  // Query for reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", setlist.show.id],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?showId=${setlist.show.id}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      return data.reviews;
    },
    initialData: initialReviews,
  });


  // Mutation for creating reviews
  const createReviewMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
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
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to create review");
      }

      const result = await response.json();

      if (!result.review) {
        throw new Error("Invalid response format from server: missing review");
      }

      return result.review;
    },
    onSuccess: async (review) => {
      toast.success("Review submitted successfully");
      queryClient.setQueryData(["reviews", setlist.show.id], (old: ReviewMinimal[] = []) => [...old, review]);

      // Refresh the average rating for the show
      queryClient.invalidateQueries({ queryKey: ["ratings", setlist.show.id, "Show"] });
    },
    onError: () => {
      toast.error("Failed to submit review. Please try again.");
    },
  });

  // Mutation for deleting reviews
  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch("/api/reviews", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
    },
    onSuccess: (_, id) => {
      toast.success("Review deleted successfully");
      queryClient.setQueryData(["reviews", setlist.show.id], (old: ReviewMinimal[] = []) =>
        old.filter((review) => review.id !== id),
      );
    },
    onError: () => {
      toast.error("Failed to delete review. Please try again.");
    },
  });

  // Mutation for updating reviews
  const updateReviewMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const response = await fetch("/api/reviews", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      const data = await response.json();
      console.log("Review updated successfully:", data);
      return data.review;
    },
    onSuccess: (review) => {
      console.log("Review updated successfully:", review);
      toast.success("Review updated successfully");
      queryClient.setQueryData(["reviews", setlist.show.id], (old: ReviewMinimal[] = []) =>
        old.map((r) => (r.id === review.id ? review : r)),
      );
    },
    onError: () => {
      toast.error("Failed to update review. Please try again.");
    },
  });

  const handleReviewSubmit = async (data: { content: string }) => {
    await createReviewMutation.mutateAsync(data);
  };

  const handleReviewDelete = async (id: string) => {
    await deleteReviewMutation.mutateAsync(id);
  };

  const handleReviewUpdate = async (id: string, content: string) => {
    await updateReviewMutation.mutateAsync({ id, content });
  };

  return (
    <div className="space-y-6 md:space-y-8">
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
    </div>
  );
}
