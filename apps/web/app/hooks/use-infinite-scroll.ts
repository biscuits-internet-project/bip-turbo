import { useCallback, useEffect, useRef, useState } from "react";

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
  const nodeRef = useRef<HTMLDivElement | null>(null);

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

  // Callback ref to capture the node
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    nodeRef.current = node;
  }, []);

  // useEffect handles observer lifecycle with proper cleanup
  useEffect(() => {
    const node = nodeRef.current;
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
  }, [currentCount, totalItems, isLoading, handleLoadMore]);

  return {
    loadMoreRef,
    isLoading,
    currentCount,
    hasMore: currentCount < totalItems,
    reset,
  };
}
