import { Prisma } from "@prisma/client";

/** Table aliases this module's fragments know how to emit. */
type TrackAlias = "t" | "tracks" | "show_tracks";

/**
 * "A track worth surfacing" — an all-timer, or one carrying a curated note. The
 * definition behind the Jam Charts listing, the `jamChart` performance filter,
 * and the shows table's Jam charts count, so those three can't disagree about
 * which performances are noteworthy.
 *
 * Parenthesized because it carries a top-level OR and gets AND-joined into a
 * surrounding WHERE.
 *
 * The client-side twin is `isNoteworthy` in
 * `apps/web/app/components/track/noteworthy-marker.tsx`, which gates the flame
 * icon on already-loaded rows. Change one, change the other.
 */
export function noteworthyTrackSql(alias: TrackAlias = "tracks"): Prisma.Sql {
  const a = Prisma.raw(alias);
  return Prisma.sql`(${a}.all_timer = true OR (${a}.note IS NOT NULL AND ${a}.note <> ''))`;
}
