/**
 * Hover treatment for the paired chips in a show row — the rating badge and the
 * attendance button. One constant because the two sit shoulder to shoulder and
 * have to answer a pointer the same way; as separate strings they drifted apart
 * the moment either was touched.
 *
 * Grow and saturate rather than a fill or an edge, because those are the only
 * things every state can show. Both buttons have states painted by
 * `glass-secondary`, whose `!important` background and border silently defeat
 * any `hover:bg-*` or `hover:border-*` beside them — a transform and a filter
 * are immune. Each chrome adds its own fill and edge on top where its state
 * allows, and those are the parts that carry the color.
 *
 * Saturate, not just brightness: these sit inline with the external-source
 * favicons, which return from grey to full color on hover
 * (`EXTERNAL_FAVICON_LINK_CLASS`). Brightening alone read as a different, weaker
 * kind of response next to that.
 */
export const ROW_CHIP_HOVER =
  "origin-center transition-all cursor-pointer hover:scale-105 hover:brightness-110 hover:saturate-150";
