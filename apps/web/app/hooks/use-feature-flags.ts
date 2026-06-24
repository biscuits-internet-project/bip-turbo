import type { FeatureFlags } from "@bip/core";
import { useRouteLoaderData } from "react-router";
import type { RootData } from "~/root";

// Used when the root loader data isn't available (e.g. inside the error
// boundary, or a component rendered outside the route tree in tests): every
// flag reads off, so the app degrades to its pre-feature behavior.
const FLAGS_OFF: FeatureFlags = {
  calibratedEnabled: false,
  toggleVisible: false,
  defaultCalibrated: false,
  compareVisible: false,
  explainerNavLink: false,
  recomputeEnabled: false,
};

/**
 * Reads the feature flags resolved server-side in the root loader. Lets a
 * client component check a flag at the point of use (`useFeatureFlags().toggleVisible`)
 * so it's obvious a flag is gating the behavior, instead of receiving an opaque
 * boolean prop resolved somewhere up the tree. SSR-seeded, so the first paint
 * already has the right values.
 */
export function useFeatureFlags(): FeatureFlags {
  const rootData = useRouteLoaderData("root") as RootData | undefined;
  return rootData?.featureFlags ?? FLAGS_OFF;
}
