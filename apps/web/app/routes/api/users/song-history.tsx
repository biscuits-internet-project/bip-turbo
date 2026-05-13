import type { PersonalSongHistory } from "@bip/core";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

const EMPTY_HISTORY: PersonalSongHistory = { attendedShows: [], songAttendances: {} };

/**
 * Backs the SetlistCard "personal" view. Returns the current user's
 * attended-show dates and per-song attendance dates as compact sorted
 * arrays. Logged-out callers get an empty payload (200) so the client
 * code path stays uniform — the UI gate hides the "personal" toggle
 * for them anyway.
 */
export const loader = publicLoader(async ({ context }) => {
  const { currentUser } = context;
  if (!currentUser) {
    return Response.json(EMPTY_HISTORY);
  }

  try {
    const user = await services.users.findByEmail(currentUser.email);
    if (!user) {
      logger.warn("Personal song history: local user record missing", { email: currentUser.email });
      return Response.json(EMPTY_HISTORY);
    }
    const history = await services.personalSongHistory.getSongHistory(user.id);
    return Response.json(history);
  } catch (error) {
    logger.error("Error fetching personal song history", { error });
    return new Response(JSON.stringify({ error: "Failed to fetch song history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
