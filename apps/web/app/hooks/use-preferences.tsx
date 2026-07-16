import { createContext, useContext, useMemo } from "react";

export type Preferences = {
  colorCodeRatings: boolean;
};

/**
 * App defaults, used wherever the viewer expressed no choice (a stored `null`)
 * and wherever the provider is absent (the error boundary, or a component
 * mounted outside the route tree in tests). A preference the viewer never set
 * behaves the same in both cases.
 *
 * Color coding is off until the rating work it belongs to is opened up more
 * broadly. Flipping this constant switches it on for everyone who hasn't made
 * an explicit choice, and leaves explicit choices on either side intact — which
 * is why the stored preference stays tri-state rather than defaulting in the
 * database.
 */
export const PREFERENCES_DEFAULT: Preferences = {
  colorCodeRatings: false,
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
  children,
}: {
  colorCodeRatings: boolean | null | undefined;
  children: React.ReactNode;
}) {
  const value = useMemo<Preferences>(
    () => ({ colorCodeRatings: colorCodeRatings ?? PREFERENCES_DEFAULT.colorCodeRatings }),
    [colorCodeRatings],
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
