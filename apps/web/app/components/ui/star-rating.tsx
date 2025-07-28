"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useSession } from "~/hooks/use-session";
import { cn } from "~/lib/utils";

interface StarRatingProps {
  className?: string;
  disabled?: boolean;
  rateableId: string;
  rateableType: string;
  initialRating?: number | null;
}

interface RatingResponse {
  userRating: number | null;
  averageRating: number | null;
}

interface ShowData {
  show: {
    id: string;
    averageRating: number | null;
    // Add other known show properties here
    [key: string]: string | number | null | undefined;
  };
  // Add other known properties here
  [key: string]: unknown;
}

interface SetlistData {
  show: {
    id: string;
    averageRating: number | null;
    [key: string]: string | number | null | undefined;
  };
  [key: string]: unknown;
}

interface LoaderData {
  json: string;
  meta?: unknown;
}

export function StarRating({ className, disabled, rateableId, rateableType, initialRating }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const queryClient = useQueryClient();
  const { user, loading: isSessionLoading } = useSession();

  // Query for rating
  const { data: rating } = useQuery({
    queryKey: ["ratings", rateableId, rateableType],
    queryFn: async () => {
      const response = await fetch(`/api/ratings?rateableId=${rateableId}&rateableType=${rateableType}`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch rating");
      }
      const data = await response.json();
      return data as RatingResponse;
    },
    enabled: !!user && !isSessionLoading && initialRating === undefined,
    initialData: initialRating !== undefined ? { userRating: initialRating, averageRating: null } : undefined,
  });

  // Mutation for submitting ratings
  const submitRatingMutation = useMutation({
    mutationFn: async (value: number) => {
      const response = await fetch("/api/ratings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rateableId,
          rateableType,
          value,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/auth/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) throw new Error("Failed to rate show");

      const data = await response.json();
      return data as RatingResponse;
    },
    onSuccess: (data) => {
      toast.success("Rating submitted successfully");

      // Update the individual rating query
      queryClient.setQueryData(["ratings", rateableId, rateableType], data);

      // Update any queries that contain this show's rating
      queryClient.setQueriesData({ type: "active" }, (old: unknown) => {
        if (!old || typeof old !== "object") return old;

        // Handle root loader data
        if ("recentShows" in old) {
          const shows = (old as { recentShows: SetlistData[] }).recentShows;
          return {
            ...old,
            recentShows: shows.map((setlist) => {
              if (setlist.show.id === rateableId) {
                return {
                  ...setlist,
                  show: {
                    ...setlist.show,
                    averageRating: data.averageRating,
                  },
                };
              }
              return setlist;
            }),
          };
        }

        // Handle show data
        if ("show" in old && (old as ShowData).show.id === rateableId) {
          return {
            ...old,
            show: {
              ...(old as ShowData).show,
              averageRating: data.averageRating,
            },
          };
        }

        return old;
      });
    },
    onError: () => {
      toast.error("Failed to submit rating. Please try again.");
    },
  });

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left;
    const isHalfStar = x < width / 2;
    const ratingValue = isHalfStar ? star - 0.5 : star;

    setIsAnimating(true);

    await submitRatingMutation.mutateAsync(ratingValue);

    // Reset animation after it completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
    if (disabled) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left;
    const isHalfStar = x < width / 2;

    setHoveredRating(isHalfStar ? star - 0.5 : star);
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  const displayRating = hoveredRating !== null ? hoveredRating : (rating?.userRating ?? initialRating ?? 0);

  return (
    <div className={cn("flex items-center gap-1 group", className)} onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = displayRating !== null && star <= displayRating;
        const half = displayRating !== null && star - 0.5 === displayRating;
        const animationDelay = (star - 1) * 200; // Stagger the animation

        return (
          <button
            key={star}
            type="button"
            onClick={(e) => handleClick(e, star)}
            onMouseMove={(e) => handleMouseMove(e, star)}
            disabled={disabled}
            className={cn("transition-colors relative", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")}
          >
            <StarIcon
              filled={filled}
              half={half}
              isAnimating={isAnimating && (filled || half)}
              delay={animationDelay}
            />
          </button>
        );
      })}
    </div>
  );
}

const StarIcon = ({
  filled,
  half,
  isAnimating,
  delay,
}: { filled: boolean; half?: boolean; isAnimating?: boolean; delay?: number }) => (
  <div className="relative">
    {/* Empty star (background) */}
    <svg
      className={cn("w-4 h-4 ms-1", filled || half ? "text-content-text-tertiary" : "text-content-text-tertiary")}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>

    {/* Filled star (overlay) */}
    {(filled || half) && (
      <div
        className={cn(
          "absolute inset-0 overflow-hidden",
          half ? "w-[50%]" : "w-full",
          isAnimating && "animate-star-pulse",
        )}
        style={{ animationDelay: delay ? `${delay}ms` : undefined }}
      >
        <svg
          className={cn("w-4 h-4 ms-1", isAnimating && "animate-star-glow")}
          style={{ 
            animationDelay: delay ? `${delay}ms` : undefined,
            color: "hsl(var(--rating-gold))"
          }}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      </div>
    )}
  </div>
);
