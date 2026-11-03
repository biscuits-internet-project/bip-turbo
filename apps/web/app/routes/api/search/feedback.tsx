import type { ActionFunctionArgs } from "react-router";
import { publicAction } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

interface FeedbackRequest {
  searchHistoryId: string;
  sentiment: "positive" | "negative";
  feedbackMessage?: string;
}

const MAX_FEEDBACK_LENGTH = 1000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface FeedbackResponse {
  success: boolean;
  message: string;
}

// POST /api/search/feedback - Submit search feedback
export const action = publicAction(async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = (await request.json()) as FeedbackRequest;
    const { searchHistoryId, sentiment, feedbackMessage } = body;

    // The body is only cast, so validate shape at runtime. `searchHistoryId` is a uuid we
    // handed the client; anything else is a bad request rather than a DB round trip.
    if (!searchHistoryId || typeof searchHistoryId !== "string" || !UUID_RE.test(searchHistoryId)) {
      throw new Response(JSON.stringify({ error: "Search history ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (feedbackMessage !== undefined) {
      if (typeof feedbackMessage !== "string" || feedbackMessage.length > MAX_FEEDBACK_LENGTH) {
        throw new Response(
          JSON.stringify({ error: `Feedback must be a string of at most ${MAX_FEEDBACK_LENGTH} characters` }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
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
    // The validation above throws its 400s as Responses; let them through instead of
    // reporting a client mistake as a server failure.
    if (error instanceof Response) throw error;

    // P2025: no search history row with that id. A well-formed but unknown uuid is the
    // caller's mistake, not ours.
    if ((error as { code?: string })?.code === "P2025") {
      return new Response(JSON.stringify({ success: false, error: "Search not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    logger.error("Search feedback API error", { error });

    // Fixed text: the underlying message can be a Prisma invocation dump. It is logged above.
    const errorMessage = "Failed to submit feedback";

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
