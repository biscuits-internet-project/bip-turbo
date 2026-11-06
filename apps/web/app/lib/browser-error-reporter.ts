export const BROWSER_ERROR_ENDPOINT = "/api/client-errors";

/**
 * Sends uncaught browser errors and missing script or stylesheet files to the server.
 *
 * This runs as an inline script, because the case it most needs to catch is the app's
 * own bundle failing to load. It's turned into text with `toString()`, so it can't use
 * imports or anything else from outside the function.
 */
export function installBrowserErrorReporter(endpoint: string): void {
  const MAX_REPORTS_PER_PAGE = 5;
  const MISSING_FILE_WAIT_MS = 5000;
  let reportsSent = 0;
  let missingFiles: string[] = [];
  let missingFileTimer: ReturnType<typeof setTimeout> | undefined;

  function send(report: Record<string, unknown>) {
    if (reportsSent >= MAX_REPORTS_PER_PAGE) return;
    reportsSent += 1;
    const body = JSON.stringify({ ...report, path: location.pathname });
    navigator.sendBeacon?.(endpoint, new Blob([body], { type: "application/json" }));
  }

  function clip(text: unknown, length: number) {
    return String(text ?? "").slice(0, length);
  }

  // A page can stay usable after losing a file, so wait to see whether the app started.
  // `hydrated: false` means the visitor was left with a page that doesn't respond.
  function sendMissingFiles() {
    clearTimeout(missingFileTimer);
    if (missingFiles.length === 0) return;
    send({
      kind: "missing-file",
      detail: clip(missingFiles[0], 200),
      count: missingFiles.length,
      hydrated: "__reactRouterDataRouter" in window,
    });
    missingFiles = [];
  }

  // Capturing is the only way to see a file failing to load, since those events don't bubble.
  window.addEventListener(
    "error",
    (event) => {
      const target = event.target as (HTMLElement & { src?: string; href?: string }) | null;
      if (target && target !== (window as unknown as EventTarget) && target.tagName) {
        const url = new URL(target.src || target.href || "", location.href);
        if (url.origin !== location.origin || !url.pathname.startsWith("/assets/")) return;
        missingFiles.push(url.pathname);
        if (missingFiles.length === 1) missingFileTimer = setTimeout(sendMissingFiles, MISSING_FILE_WAIT_MS);
        return;
      }

      // Browser extensions and other sites' scripts aren't ours to fix, and browsers hide
      // the details of cross-origin errors anyway.
      if (!event.filename || !event.filename.startsWith(location.origin)) return;
      send({
        kind: "script-error",
        detail: clip(event.message, 300),
        source: clip(event.filename, 200),
        line: event.lineno,
        stack: clip(event.error?.stack, 2000),
      });
    },
    true,
  );

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    send({
      kind: "unhandled-rejection",
      detail: clip(reason?.message ?? reason, 300),
      stack: clip(reason?.stack, 2000),
    });
  });

  // A page reloading itself would otherwise lose whatever is still waiting.
  window.addEventListener("pagehide", sendMissingFiles);
}

export const browserErrorReporterScript = `(${installBrowserErrorReporter.toString()})(${JSON.stringify(BROWSER_ERROR_ENDPOINT)})`;
