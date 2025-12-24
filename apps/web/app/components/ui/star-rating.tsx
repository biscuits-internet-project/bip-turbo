"use client";

import { useEffect, useRef, useState } from "react";
import { useRevalidator } from "react-router-dom";
import { toast } from "sonner";
import { useSession } from "~/hooks/use-session";
import { cn } from "~/lib/utils";

interface StarRatingProps {
  className?: string;
  disabled?: boolean;
  rateableId: string;
  rateableType: string;
  initialRating?: number | null;
  showSlug?: string;
  onRatingChange?: (rating: number) => void;
}

interface RatingResponse {
  userRating: number | null;
  averageRating: number | null;
}

export function StarRating({
  className,
  disabled,
  rateableId,
  rateableType,
  initialRating,
  showSlug,
  onRatingChange,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<RatingResponse | null>(
    initialRating !== undefined ? { userRating: initialRating, averageRating: null } : null
  );
  const { user, loading: isSessionLoading } = useSession();
  const revalidator = useRevalidator();
  const isMountedRef = useRef<boolean>(true);
  const hasFetchedRef = useRef<boolean>(false);

  // Track mounted state for cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch rating if needed (only when user is logged in and no initial rating provided)
  useEffect(() => {
    if (!user || isSessionLoading || initialRating !== undefined || hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;

    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/ratings?rateableId=${rateableId}&rateableType=${rateableType}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          if (response.status === 404) return;
          throw new Error("Failed to fetch rating");
        }
        const data = await response.json();
        if (isMountedRef.current) {
          setRating(data as RatingResponse);
        }
      } catch {
        // Silently fail - rating will just not be displayed
      }
    };

    fetchRating();
  }, [user, isSessionLoading, initialRating, rateableId, rateableType]);

  const submitRating = async (value: number) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rateableId,
          rateableType,
          value,
          showSlug,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/auth/login";
        return;
      }

      if (!response.ok) throw new Error("Failed to rate show");

      const data = (await response.json()) as RatingResponse;

      toast.success("Rating submitted successfully");
      setRating(data);

      if (onRatingChange) {
        onRatingChange(data.userRating ?? 0);
      }

      // Revalidate to update any cached data
      revalidator.revalidate();
    } catch {
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isSubmitting) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left;
    const isHalfStar = x < width / 2;
    const ratingValue = isHalfStar ? star - 0.5 : star;

    setIsAnimating(true);

    await submitRating(ratingValue);

    // Reset animation after it completes
    setTimeout(() => {
      if (isMountedRef.current) setIsAnimating(false);
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
    <fieldset
      className={cn("flex items-center gap-1 group border-0 p-0 m-0", className)}
      onMouseLeave={handleMouseLeave}
    >
      <legend className="sr-only">Star rating</legend>
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
    </fieldset>
  );
}

const StarIcon = ({
  filled,
  half,
  isAnimating,
  delay,
}: {
  filled: boolean;
  half?: boolean;
  isAnimating?: boolean;
  delay?: number;
}) => (
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
            color: "hsl(var(--rating-gold))",
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
