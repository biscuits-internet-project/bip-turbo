// Slugs of the Marlon-era band members, applied as the default lineup when a
// show is created with no explicit lineup. The musicians themselves (and the
// instrument vocabulary) are seeded by the add_musicians_performers migration;
// this list is how the service resolves them back to ids at create time.
//
// No server-only imports, so this is safe to pull into client bundles (filter
// controls, lineup display) as well as services.
export const MARLON_LINEUP_SLUGS = ["jon-gutwillig", "marc-brownstein", "aron-magner", "marlon-lewis"] as const;
