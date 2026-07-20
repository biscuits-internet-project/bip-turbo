import { RATING_DISPLAY_DECIMALS_DEFAULT } from "@bip/domain";
import { createContext, useContext, useMemo } from "react";

export type Preferences = {
  colorCodeRatings: boolean;
  showSetlistTimes: boolean;
  /** Decimal places rating scores render at (1-4); resolved from the viewer's choice. */
  ratingDecimalPlaces: number;
};

/**
 * App defaults, used wherever the viewer expressed no choice (a stored `null`)
 * and wherever the provider is absent (the error boundary, or a component
 * mounted outside the route tree in tests). A preference the viewer never set
 * behaves the same in both cases.
 *
 * Color coding is off until the rating work it belongs to is opened up more
 * broadly. Setlist times are on, matching how the setlist has always rendered:
 * only a viewer who asks for a cleaner setlist loses them. Flipping either
 * constant moves everyone who hasn't made an explicit choice, and leaves
 * explicit choices on either side intact — which is why the stored preferences
 * stay tri-state rather than defaulting in the database.
 */
export const PREFERENCES_DEFAULT: Preferences = {
  colorCodeRatings: false,
  showSetlistTimes: true,
  ratingDecimalPlaces: RATING_DISPLAY_DECIMALS_DEFAULT,
};

const PreferencesContext = createContext<Preferences>(PREFERENCES_DEFAULT);

/**
 * Seeds the viewer's display preferences from the root loader. Context rather
 * than `useRouteLoaderData` at the point of use because these are read by leaf
 * components (rating values) rendered from nearly every page: a context has a
 * usable default outside a data router, so component tests don't each have to
 * stub the router or mock the hook.
 *
 * Takes the stored tri-state (`null` = never chose) and resolves the default
 * here, so the fallback lives in exactly one place.
 */
export function PreferencesProvider({
  colorCodeRatings,
  showSetlistTimes,
  ratingDecimalPlaces,
  children,
}: {
  colorCodeRatings: boolean | null | undefined;
  showSetlistTimes: boolean | null | undefined;
  // Optional so the many test wrappers that don't exercise it can omit it; it
  // resolves to the default below when absent, like any unset preference.
  ratingDecimalPlaces?: number | null | undefined;
  children: React.ReactNode;
}) {
  const value = useMemo<Preferences>(
    () => ({
      colorCodeRatings: colorCodeRatings ?? PREFERENCES_DEFAULT.colorCodeRatings,
      showSetlistTimes: showSetlistTimes ?? PREFERENCES_DEFAULT.showSetlistTimes,
      ratingDecimalPlaces: ratingDecimalPlaces ?? PREFERENCES_DEFAULT.ratingDecimalPlaces,
    }),
    [colorCodeRatings, showSetlistTimes, ratingDecimalPlaces],
  );
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

/**
 * Reads the viewer's display preferences at the point of use
 * (`usePreferences().colorCodeRatings`) instead of having the value threaded
 * down as a prop through every rating call site. SSR-seeded, so the first paint
 * already has the right values.
 */
export function usePreferences(): Preferences {
  return useContext(PreferencesContext);
}
