import type * as React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "global-search-query";

interface GlobalSearchContextType {
  isOpen: boolean;
  query: string;
  setQuery: (query: string) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQueryState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) || "";
    }
    return "";
  });

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    if (typeof window !== "undefined") {
      if (newQuery) {
        localStorage.setItem(STORAGE_KEY, newQuery);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K on Mac, Ctrl+K on PC
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }

      // Also handle Cmd+/ for search
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  const value = {
    isOpen,
    query,
    setQuery,
    open,
    close,
    toggle,
  };

  return <GlobalSearchContext.Provider value={value}>{children}</GlobalSearchContext.Provider>;
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (context === undefined) {
    throw new Error("useGlobalSearch must be used within a GlobalSearchProvider");
  }
  return context;
}
