import type { ReviewMinimal, Setlist } from "@bip/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
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
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
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
}

// Add interface for the beta search API response
interface ArchiveSearchHit {
  _source: {
    identifier: string;
    title?: string;
    date?: string;
  };
}

export const loader = publicLoader(async ({ params, context }): Promise<ShowLoaderData> => {
  console.log("⚡️ shows.$slug loader:", params.slug);
  const slug = params.slug;
  if (!slug) throw notFound();

  const setlist = await services.setlists.findByShowSlug(slug);
  if (!setlist) throw notFound();

  const reviews = await services.reviews.findByShowId(setlist.show.id);

  // Find Archive.org recordings for this show date
  let selectedRecordingId: string | null = null;

  // Make a second request to get the actual items
  const detailsUrl = `https://archive.org/advancedsearch.php?q=collection:DiscoBiscuits AND date:${setlist.show.date}&fl=identifier,title,date&sort=date desc&rows=100&output=json`;

  console.log("Fetching recording details:", detailsUrl);

  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) {
    throw new Error(`Failed to fetch recording details: ${detailsResponse.status}`);
  }

  const detailsData = await detailsResponse.json();

  if (detailsData?.response?.docs && detailsData.response.docs.length > 0) {
    const archiveRecordings = detailsData.response.docs as ArchiveItem[];

    if (archiveRecordings.length > 0) {
      selectedRecordingId = archiveRecordings[0].identifier;
    }
  }

  return { setlist, reviews, selectedRecordingId };
});

export function meta({ data }: { data: ShowLoaderData }) {
  const showDate = formatDateLong(data.setlist.show.date);
  const venueName = data.setlist.show.venue?.name ?? "Unknown Venue";
  const cityState = `${data.setlist.show.venue?.city}, ${data.setlist.show.venue?.state}`;

  return [
    { title: `${showDate} - ${venueName} - ${cityState} | Biscuits Internet Project` },
    {
      name: "description",
      content: `View setlist, reviews, and recordings from the Disco Biscuits show at ${venueName} in ${cityState} on ${showDate}.`,
    },
  ];
}

export default function Show() {
  const { setlist, reviews: initialReviews, selectedRecordingId } = useSerializedLoaderData<ShowLoaderData>();
  const { user, supabase } = useSession();
  const queryClient = useQueryClient();

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

      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from server");
      }

      let result: { json: { review?: ReviewMinimal } };
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response:", e);
        console.error("Response text was:", text);
        throw new Error("Invalid JSON response from server");
      }

      if (!result.json.review) {
        throw new Error("Invalid response format from server: missing review");
      }

      return result.json.review;
    },
    onSuccess: (review) => {
      toast.success("Review submitted successfully");
      queryClient.setQueryData(["reviews", setlist.show.id], (old: ReviewMinimal[] = []) => [...old, review]);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">{formatDateLong(setlist.show.date)}</h1>
        <AdminOnly>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/shows/${setlist.show.slug}/edit`} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span>Edit Show</span>
            </Link>
          </Button>
        </AdminOnly>
      </div>

      {/* Main content area with responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Setlist */}
        <div className="lg:col-span-8">
          <SetlistCard
            key={setlist.show.id}
            setlist={setlist}
            userAttendance={null}
            userRating={null}
            showRating={setlist.show.averageRating}
          />


          <div className="mt-6">
            {reviews && reviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-content-text-secondary">No reviews yet. Be the first to share your thoughts!</p>
              </div>
            )}
            {user && !reviews.some((review: ReviewMinimal) => review.userId === user.id) && (
              <div className="mb-8">
                <ReviewForm onSubmit={handleReviewSubmit} />
              </div>
            )}
            {reviews && reviews.length > 0 && (
              <ReviewsList
                reviews={reviews}
                currentUserId={user?.id}
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
