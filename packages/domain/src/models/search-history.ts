import { z } from "zod";

export const searchHistorySchema = z.object({
  id: z.string().uuid(),
  searchQuery: z.string().min(1),
  resultCount: z.number().int().min(0).default(0),
  searchType: z.enum(["songs", "venues", "shows", "setlists"]),
  sentiment: z.enum(["positive", "negative"]).nullable().optional(),
  feedbackMessage: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSearchHistorySchema = z.object({
  searchQuery: z.string().min(1),
  resultCount: z.number().int().min(0).default(0),
  searchType: z.enum(["songs", "venues", "shows", "setlists"]),
});

export const updateSearchHistorySchema = z.object({
  sentiment: z.enum(["positive", "negative"]),
  feedbackMessage: z.string().optional(),
});

export type SearchHistory = z.infer<typeof searchHistorySchema>;
export type CreateSearchHistory = z.infer<typeof createSearchHistorySchema>;
export type UpdateSearchHistory = z.infer<typeof updateSearchHistorySchema>;