import { isRouteErrorResponse } from "react-router";
import { logger } from "~/server/logger";

const MAX_SUMMARY_LENGTH = 120;

function summarize(thrown: unknown): string {
  const text = thrown instanceof Error ? `${thrown.name}: ${thrown.message.trim().split("\n")[0]}` : String(thrown);
  return text.slice(0, MAX_SUMMARY_LENGTH);
}

/**
 * Logs an error React Router caught while handling a request. The summary goes
 * in the log message because Grafana groups and alerts on that field, so each
 * kind of uncaught error gets its own row instead of sharing one.
 */
export function reportServerError(error: unknown, request: Request): void {
  // The visitor left, which isn't a failure.
  if (request.signal.aborted) return;
  // Unknown URLs (mostly bots) and bad requests are the client's problem.
  if (isRouteErrorResponse(error) && error.status < 500) return;

  // A route error response wraps the real Error, which is what has the stack.
  const wrapped = isRouteErrorResponse(error) ? (error as { error?: unknown }).error : undefined;
  const thrown = wrapped ?? error;
  const { pathname } = new URL(request.url);
  logger.error(`Uncaught server error: ${summarize(thrown)}`, {
    error: thrown,
    method: request.method,
    path: pathname,
  });
}
