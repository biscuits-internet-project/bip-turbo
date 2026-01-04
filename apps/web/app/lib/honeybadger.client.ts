import Honeybadger from "@honeybadger-io/js";

type HoneybadgerClient = typeof Honeybadger;

type ClientInitOptions = {
  apiKey: string;
  environment: string;
};

type Metadata = Record<string, unknown>;

let honeybadgerClient: HoneybadgerClient | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getClient(): HoneybadgerClient | null {
  if (!isBrowser()) {
    return null;
  }

  return honeybadgerClient;
}

export function initHoneybadgerClient({ apiKey, environment }: ClientInitOptions): HoneybadgerClient | null {
  if (!isBrowser()) {
    return null;
  }

  if (!honeybadgerClient) {
    honeybadgerClient = Honeybadger.configure({
      apiKey,
      environment,
      reportData: true,
      breadcrumbsEnabled: true,
    });

    honeybadgerClient.setContext({
      environment,
    });
  }

  return honeybadgerClient;
}

export function trackClientSubmit(name: string, metadata: Metadata = {}): void {
  const client = getClient();
  if (!client) {
    return;
  }

  client.addBreadcrumb(name, {
    category: "submit",
    metadata,
  });
}

export function notifyClientError(error: unknown, options: { context?: Metadata; name?: string } = {}): void {
  const client = getClient();
  if (!client) {
    return;
  }

  const context = options.context ?? {};
  const errorName = options.name ?? "ClientError";
  if (error instanceof Error) {
    const noticeName = error.name || errorName;
    client.notify(error, { name: noticeName, context });
    return;
  }

  const normalizedError = typeof error === "string" ? new Error(error) : new Error("Unknown client error");
  normalizedError.name = errorName;
  client.notify(normalizedError, { name: errorName, context });
}

export function setHoneybadgerContext(context: Metadata): void {
  const client = getClient();
  if (!client) {
    return;
  }

  client.setContext({
    ...(context ?? {}),
  });
}
