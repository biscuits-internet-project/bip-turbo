import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { installBrowserErrorReporter } from "./browser-error-reporter";

const beacons: Blob[] = [];
// Each test gets its own reporter, since its report limit lasts as long as the page does.
const removeListeners: Array<() => void> = [];

async function sentReports() {
  return Promise.all(beacons.map(async (blob) => JSON.parse(await blob.text())));
}

function failToLoad(tag: "script" | "link", url: string) {
  const element = document.createElement(tag);
  if (element instanceof HTMLScriptElement) element.src = url;
  else if (element instanceof HTMLLinkElement) element.href = url;
  document.head.append(element);
  element.dispatchEvent(new Event("error"));
  element.remove();
}

function throwInPage(message: string, filename: string) {
  window.dispatchEvent(new ErrorEvent("error", { message, filename, lineno: 12, error: new Error(message) }));
}

describe("installBrowserErrorReporter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    beacons.length = 0;
    Object.defineProperty(navigator, "sendBeacon", {
      configurable: true,
      value: (_url: string, blob: Blob) => beacons.push(blob) > 0,
    });
    delete (window as unknown as Record<string, unknown>).__reactRouterDataRouter;

    const addListener = window.addEventListener.bind(window);
    const spy = vi.spyOn(window, "addEventListener").mockImplementation(((
      type: string,
      listener: EventListener,
      capture?: boolean,
    ) => {
      addListener(type, listener, capture);
      removeListeners.push(() => window.removeEventListener(type, listener, capture));
    }) as typeof window.addEventListener);
    installBrowserErrorReporter("/api/client-errors");
    spy.mockRestore();
  });

  afterEach(() => {
    for (const remove of removeListeners.splice(0)) remove();
    vi.useRealTimers();
  });

  test("groups a page's missing files into one report saying the app never started", async () => {
    failToLoad("script", `${location.origin}/assets/entry.client-old.js`);
    failToLoad("link", `${location.origin}/assets/root-old.js`);
    expect(beacons).toHaveLength(0);

    vi.advanceTimersByTime(5000);

    expect(await sentReports()).toEqual([
      expect.objectContaining({
        kind: "missing-file",
        detail: "/assets/entry.client-old.js",
        count: 2,
        hydrated: false,
      }),
    ]);
  });

  test("says the app started when it did, so a page that recovered isn't counted as broken", async () => {
    (window as unknown as Record<string, unknown>).__reactRouterDataRouter = {};
    failToLoad("link", `${location.origin}/assets/route-old.js`);

    vi.advanceTimersByTime(5000);

    expect((await sentReports())[0]).toMatchObject({ kind: "missing-file", hydrated: true });
  });

  test("sends missing files straight away if the page is leaving", async () => {
    failToLoad("script", `${location.origin}/assets/route-old.js`);

    window.dispatchEvent(new Event("pagehide"));

    expect(await sentReports()).toHaveLength(1);
  });

  test("ignores files that aren't the app's own", () => {
    failToLoad("script", "https://ads.example.com/assets/tag.js");
    failToLoad("script", `${location.origin}/images/logo.js`);

    vi.advanceTimersByTime(5000);

    expect(beacons).toHaveLength(0);
  });

  test("reports an uncaught error from the app's scripts without the query string", async () => {
    window.history.pushState({}, "", "/shows/year/2004?nugs=true");

    throwInPage("boom", `${location.origin}/assets/root.js`);

    expect((await sentReports())[0]).toMatchObject({
      kind: "script-error",
      detail: "boom",
      line: 12,
      path: "/shows/year/2004",
    });
  });

  test("ignores errors from extensions and other sites", () => {
    throwInPage("extension broke", "chrome-extension://abc/content.js");
    throwInPage("Script error.", "");

    expect(beacons).toHaveLength(0);
  });

  test("reports an unhandled promise rejection", async () => {
    const event = new Event("unhandledrejection") as Event & { reason: Error };
    event.reason = new TypeError("Failed to fetch dynamically imported module");

    window.dispatchEvent(event);

    expect((await sentReports())[0]).toMatchObject({
      kind: "unhandled-rejection",
      detail: "Failed to fetch dynamically imported module",
    });
  });

  test("stops after 5 reports so a failing loop can't flood the server", () => {
    for (let i = 0; i < 20; i += 1) throwInPage("loop", `${location.origin}/assets/root.js`);

    expect(beacons).toHaveLength(5);
  });
});
