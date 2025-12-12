import type { ActionFunctionArgs } from "react-router";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

interface FeedbackRequest {
  searchHistoryId: string;
  sentiment: "positive" | "negative";
  feedbackMessage?: string;
}

interface FeedbackResponse {
  success: boolean;
  message: string;
}

// POST /api/search/feedback - Submit search feedback
export const action = publicLoader(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = (await request.json()) as FeedbackRequest;
    const { searchHistoryId, sentiment, feedbackMessage } = body;

    if (!searchHistoryId) {
      throw new Response(JSON.stringify({ error: "Search history ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!sentiment || !["positive", "negative"].includes(sentiment)) {
      throw new Response(JSON.stringify({ error: "Valid sentiment (positive/negative) is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update search feedback using PostgreSQL search service
    await services.postgresSearch.updateSearchFeedback(searchHistoryId, sentiment, feedbackMessage);

    const response: FeedbackResponse = {
      success: true,
      message: "Feedback submitted successfully",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    logger.error("Search feedback API error", { error });

    const errorMessage = error instanceof Error ? error.message : "Failed to submit feedback";

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});