import { useCallback, useState } from "react";

interface UseInfiniteScrollOptions {
  totalItems: number;
  itemsPerPage: number;
  delayMs?: number;
}

interface UseInfiniteScrollReturn {
  loadMoreRef: (node: HTMLDivElement | null) => void;
  isLoading: boolean;
  currentCount: number;
  hasMore: boolean;
  reset: () => void;
}

export function useInfiniteScroll({
  totalItems,
  itemsPerPage,
  delayMs = 100,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [currentCount, setCurrentCount] = useState(itemsPerPage);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentCount((prev) => Math.min(prev + itemsPerPage, totalItems));
      setIsLoading(false);
    }, delayMs);
  }, [totalItems, itemsPerPage, delayMs]);

  const reset = useCallback(() => {
    setCurrentCount(itemsPerPage);
  }, [itemsPerPage]);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first.isIntersecting && !isLoading && currentCount < totalItems) {
            handleLoadMore();
          }
        },
        { rootMargin: "800px" },
      );

      observer.observe(node);

      return () => {
        observer.disconnect();
      };
    },
    [currentCount, totalItems, isLoading, handleLoadMore],
  );

  return {
    loadMoreRef: ref,
    isLoading,
    currentCount,
    hasMore: currentCount < totalItems,
    reset,
  };
}
