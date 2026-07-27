/**
 * The first year the catalog covers. Bounds every year axis and year-range
 * filter, and screens out debut dates that predate the band (a data anomaly)
 * from debut-year statistics.
 *
 * Lives in the domain package because both sides need the same number: the web
 * app builds year filters and chart axes from it, and the core package's
 * cross-show stats query screens debut years against it. A copy on either side
 * would be exactly the kind of drift that made the shows table and a show's own
 * page disagree.
 */
export const START_YEAR = 1995;
