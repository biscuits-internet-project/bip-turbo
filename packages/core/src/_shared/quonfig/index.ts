import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { type Contexts, Quonfig } from "@quonfig/node";

/**
 * Fully-local quonfig client (datadir mode, no network/account). Reads the
 * committed `quonfig/` workspace from disk and evaluates flags/configs in memory.
 * The datadir + environment are env-overridable so scripts, the web server, and
 * the docker image can point at the right copy. See the `quonfig/` workspace for
 * the flag/config definitions.
 */

/**
 * Resolve the `quonfig/` workspace. `QUONFIG_DATADIR` wins (set in the docker
 * image); otherwise walk up from cwd to find the committed workspace, so it
 * resolves no matter which package dir a process is launched from (the web dev
 * server runs from `apps/web`, scripts from `packages/core`, etc.).
 */
function datadir(): string {
  if (process.env.QUONFIG_DATADIR) return process.env.QUONFIG_DATADIR;
  let dir = process.cwd();
  while (true) {
    const candidate = join(dir, "quonfig");
    if (existsSync(join(candidate, "quonfig.json"))) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return join(process.cwd(), "quonfig");
}
function environment(): string {
  return process.env.QUONFIG_ENVIRONMENT ?? "development";
}

// Surface a workspace-load failure once in server logs. We degrade to fallbacks
// rather than throwing (a flag read must never 500 the page), but the failure
// must be visible — a silent fallback hides a real misconfig (wrong datadir,
// missing quonfig/ in the image), which reads as "my flags aren't working."
let warnedQuonfigFailure = false;
function warnQuonfigUnavailable(error: unknown): void {
  if (warnedQuonfigFailure) return;
  warnedQuonfigFailure = true;
  // biome-ignore lint/suspicious/noConsole: server-side config-load failure must reach the logs.
  console.error("[quonfig] failed to load the rating workspace; using fallback defaults.", error);
}

let initPromise: Promise<Quonfig> | undefined;

/** Lazily-initialized singleton; awaits the one-time datadir load. */
export async function getQuonfig(): Promise<Quonfig> {
  if (!initPromise) {
    const client = new Quonfig({
      datadir: datadir(),
      environment: environment(),
      enableSSE: false,
      fallbackPollEnabled: false,
    });
    // Don't cache a failed init — clear it so a later call can retry instead of
    // permanently re-throwing the cached rejection.
    initPromise = client
      .init()
      .then(() => client)
      .catch((error) => {
        initPromise = undefined;
        throw error;
      });
  }
  return initPromise;
}

/** The viewer context flag rules target on (segments / per-user). Username, not
 * email — segment files are committed to a public repo, and usernames are public. */
export interface RatingContext {
  user?: { id?: string | null; username?: string | null };
}

function toContexts(context?: RatingContext): Contexts | undefined {
  if (!context?.user) return undefined;
  const user: Record<string, unknown> = {};
  if (context.user.id != null) user.id = context.user.id;
  if (context.user.username != null) user.username = context.user.username;
  return { user };
}

export interface FeatureFlags {
  calibratedEnabled: boolean;
  toggleVisible: boolean;
  defaultCalibrated: boolean;
  compareVisible: boolean;
  explainerNavLink: boolean;
  recomputeEnabled: boolean;
}

// Degraded defaults if the datadir can't be read (misconfig). Matches the launch
// JSON: the feature runs and the cron computes, but no segment-gated toggle shows
// (segments can't evaluate without the workspace), so everyone falls to the simple
// average. A broken flag read must never take down a page.
const FALLBACK_FLAGS: FeatureFlags = {
  calibratedEnabled: true,
  toggleVisible: false,
  defaultCalibrated: false,
  compareVisible: false,
  explainerNavLink: false,
  recomputeEnabled: true,
};

/**
 * Both opt-in controls (the calibrated toggle, the compare overlay) sit behind the
 * master kill switch: when `calibrated-enabled` is off the whole feature is dead, so
 * neither may render regardless of its own segment flag. Centralizing the AND here
 * means consumers just read the resolved flag and never have to re-check the gate.
 */
export function controlVisibleUnderGate(calibratedEnabled: boolean, ownFlag: boolean): boolean {
  return calibratedEnabled && ownFlag;
}

/** All feature flags resolved for a viewer (segment/per-user aware). */
export async function getFeatureFlags(context?: RatingContext): Promise<FeatureFlags> {
  let quonfig: Quonfig;
  try {
    quonfig = await getQuonfig();
  } catch (error) {
    warnQuonfigUnavailable(error);
    return FALLBACK_FLAGS;
  }
  const ctx = toContexts(context);
  const calibratedEnabled = quonfig.getBool("ratings.calibrated-enabled", ctx) ?? false;
  return {
    calibratedEnabled,
    // resolveRatingMode already forces simple when the gate is off; gating the control
    // visibility here too means the opt-in + compare toggles disappear entirely (the
    // kill switch's documented behavior), not just go inert.
    toggleVisible: controlVisibleUnderGate(calibratedEnabled, quonfig.getBool("ratings.toggle-visible", ctx) ?? false),
    defaultCalibrated: quonfig.getBool("ratings.default-calibrated", ctx) ?? false,
    compareVisible: controlVisibleUnderGate(
      calibratedEnabled,
      quonfig.getBool("ratings.compare-visible", ctx) ?? false,
    ),
    explainerNavLink: quonfig.getBool("ratings.explainer-nav-link") ?? false,
    recomputeEnabled: quonfig.getBool("ratings.recompute-enabled") ?? false,
  };
}
