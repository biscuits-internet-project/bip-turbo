import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import honeybadger from "~/lib/honeybadger";

export const streamTimeout = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let timeoutId: NodeJS.Timeout | null = null;
    const userAgent = request.headers.get("user-agent");

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(<ServerRouter context={routerContext} url={request.url} />, {
      [readyOption]() {
        shellRendered = true;
        // Clear timeout when response is ready
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);

        responseHeaders.set("Content-Type", "text/html");

        resolve(
          new Response(stream, {
            headers: responseHeaders,
            status: responseStatusCode,
          }),
        );

        pipe(body);
      },
      onShellError(error: unknown) {
        // Clear timeout on error
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        honeybadger.notify(error as Error);
        reject(error);
      },
      onError(error: unknown) {
        const statusCode = 500;
        responseHeaders.set("status", statusCode.toString());
        // Log streaming rendering errors from inside the shell.  Don't log
        // errors encountered during initial shell rendering since they'll
        // reject and get logged in handleDocumentRequest.
        if (shellRendered) {
          honeybadger.notify(error as Error);
          console.error(error);
        }
      },
    });

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    timeoutId = setTimeout(() => {
      timeoutId = null;
      abort();
    }, streamTimeout + 1000);
  });
}
