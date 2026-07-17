import type { ShowRankComparison } from "@bip/core";
import type { Attendance, Rating, Setlist } from "@bip/domain";
import { Check } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalibratedSummary } from "~/components/rating/calibrated-summary";
import { RatingBadgeButton } from "~/components/rating/rating-badge-button";
import { ShowLineupNote } from "~/components/show/show-lineup-note";
import { ShowDate } from "~/components/show-date";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useSession } from "~/hooks/use-session";
import { useAttendanceMutation } from "~/hooks/use-show-user-data";
import { formatVenueLocation } from "~/lib/format-venue";
import { ROW_CHIP_HOVER } from "~/lib/interaction-styles";
import { deriveShowLineupNotes } from "~/lib/lineup-notes";
import { cn } from "~/lib/utils";
import { AnniversaryBadge } from "./anniversary-badge";
import { RockOperaAnnotations } from "./rock-opera-annotations";
import { SetlistFlow } from "./setlist-flow";
import { SetlistTable } from "./setlist-table";
import { SetlistTablePersonal } from "./setlist-table-personal";
import { SetlistViewControl, type SetlistViewSummary } from "./setlist-view-control";
import { ShowExternalBadges, type ShowExternalSources } from "./show-external-badges";

export type SetlistView = "setlist" | "gap-chart" | "personal";

/**
 * Chrome for a show the viewer marked attended: a green fill, edge and glow.
 *
 * The fill earns its place beyond looks — `ROW_CHIP_HOVER` brightens and
 * saturates, and both are filters, so without a background they have almost
 * nothing to act on and the hover reads as broken.
 *
 * Every green here resolves from `green-500`: fill and border via Tailwind's
 * `--color-green-500`, the glow via the bare `--green-500`. The glow used to
 * hardcode stock Tailwind green, which never matched the border it sat on.
 */
const ATTENDED_CHROME =
  "bg-green-500/10 border border-green-500/50 shadow-[0_0_8px_hsl(var(--green-500)/0.2)] hover:bg-green-500/20 hover:border-green-500/80";

/**
 * Chrome for a show not yet marked attended: the same frosted surface
 * `glass-secondary` paints, but reached through the raw tokens instead of that
 * class, so hover can answer in green the way the attended state does.
 *
 * `glass-secondary` sets `background-color` AND `border` with `!important`,
 * which silently defeats any hover utility beside it — this button carried a
 * `hover:border-green-500/30` that has never once rendered. Naming the same
 * tokens directly reproduces the surface exactly while leaving hover free.
 *
 * The border is solid rather than dashed on purpose: the class list here used
 * to say `border-dashed`, but `glass-secondary`'s `!important` overrode it, so
 * solid is what has always shipped and what people recognise.
 */
const UNATTENDED_CHROME = [
  "bg-[var(--glass-bg-secondary)] border border-[var(--glass-border)]",
  // The blur token is a whole filter function, not a length, so it can't feed
  // Tailwind's `backdrop-blur-[…]`; set the property directly to avoid
  // restating 12px here.
  "[backdrop-filter:var(--backdrop-blur)]",
  "hover:bg-green-500/10 hover:border-green-500/50",
].join(" ");

interface SetlistCardProps {
  setlist: Setlist;
  userAttendance: Attendance | null;
  userRating: Rating | number | null;
  showRating: number | null;
  /**
   * Count shown beside the ★ score. In calibrated mode this is the calibrated
   * (post-exclusion) contributing count; absent ⇒ the canonical deduped count.
   */
  showRatingCount?: number | null;
  /**
   * The canonical (deduped community) average, read live from useShowUserData.
   * Used by the calibrated/rank comparison summary, which always compares
   * against the canonical score regardless of the viewer's display mode.
   * Ratings no longer ride in the structural setlist blob, so this is supplied
   * by the parent rather than read off `setlist.show`.
   */
  canonicalRating?: number | null;
  externalSources?: ShowExternalSources;
  /**
   * Simple→calibrated score + rank summary for this show. Rendered next to the ★
   * score when present. Optional — only set for viewers with the comparison
   * overlay enabled.
   */
  rankComparison?: ShowRankComparison | null;
  /**
   * When true, the card starts with its body hidden and opens on header click.
   * Clicks originating from interactive descendants (links, buttons) are
   * ignored so they keep working without toggling the card.
   */
  collapsible?: boolean;
  /**
   * Initial view for the setlist/gap-chart toggle. Defaults to "setlist".
   * The /shows/:slug route reads `?view=gap-chart` and passes it here so a
   * shared link round-trips into the table view.
   */
  defaultView?: SetlistView;
  /**
   * Called whenever the user flips the toggle. Wired only on /shows/:slug
   * to round-trip `?view=gap-chart` through the URL; list pages omit this
   * so toggling stays local to each card.
   */
  onViewChange?: (view: SetlistView) => void;
}

function SetlistCardComponent({
  setlist,
  userAttendance,
  userRating,
  showRating,
  showRatingCount,
  canonicalRating,
  externalSources,
  rankComparison,
  collapsible = false,
  defaultView = "setlist",
  onViewChange,
}: SetlistCardProps) {
  const [view, setView] = useState<SetlistView>(defaultView);
  function changeView(next: SetlistView) {
    setView(next);
    onViewChange?.(next);
  }
  const { user } = useSession();
  const [personalSummary, setPersonalSummary] = useState<{
    average: number | null;
    median: number | null;
    debutCount: number;
  }>({ average: null, median: null, debutCount: 0 });

  // Pre-build the two summary shapes so the SetlistViewControl call sites
  // stay one-liners. The catalog summary is server-computed; the personal
  // summary is hoisted from SetlistTablePersonal via onSummaryChange.
  const catalogSummary: SetlistViewSummary = {
    label: "average / median song gap",
    average: setlist.averageSongGap,
    median: setlist.medianSongGap,
    debutCount: setlist.debutCount,
  };
  const personalSummaryView: SetlistViewSummary = {
    label: "your average / median song gap",
    average: personalSummary.average,
    median: personalSummary.median,
    debutCount: personalSummary.debutCount,
  };
  const [isAttendanceAnimating, setIsAttendanceAnimating] = useState(false);
  const [localAttendance, setLocalAttendance] = useState<Attendance | null>(userAttendance);
  const [isOpen, setIsOpen] = useState(!collapsible);
  // Lazy-mount the heavy body (the full setlist is ~20+ track links plus lineup
  // notes and the view control). On list pages like /shows/top-rated, 100
  // collapsible cards would otherwise mount 100 full setlists up front (~16k DOM
  // nodes), which makes the page sluggish to click. Non-collapsible cards (the
  // show page) render immediately. Once opened it stays mounted, so re-collapsing
  // still animates and re-opening is instant.
  const [hasMountedBody, setHasMountedBody] = useState(!collapsible);

  const attendanceMutation = useAttendanceMutation();
  const attendanceAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup attendance animation timeout on unmount. Rating animation +
  // expand/collapse state live inside RatingBadgeButton.
  useEffect(() => {
    return () => {
      if (attendanceAnimationTimeoutRef.current) clearTimeout(attendanceAnimationTimeoutRef.current);
    };
  }, []);

  // Sync attendance state with props
  useEffect(() => {
    setLocalAttendance(userAttendance);
  }, [userAttendance]);

  // Derived state for whether user is attending
  const isAttending = !!localAttendance;

  // Soundchecks, radio sessions, late-night side sets, etc. are flagged
  // count_for_stats=false. Mark them in the header (muted + tag) the same way
  // muted table rows signal it, so list scanning catches it without pulling the
  // full show-page banner into the card.
  const notForStats = setlist.show.countForStats === false;

  // Resolve the user's rating from either of the supported prop shapes
  // (a Rating object or a bare number) into a single value for the badge.
  const resolvedUserRating = typeof userRating === "number" ? userRating : (userRating?.value ?? null);
  const displayedRating = showRating ?? null;
  // In calibrated mode the count is the post-exclusion contributing count (passed
  // alongside the calibrated score); otherwise the canonical deduped count. Both
  // arrive live from useShowUserData — ratings no longer live in the setlist blob.
  const displayedCount = showRatingCount ?? null;

  // Compact calibrated-score + rank summary, rendered to the right of the ★ score.
  const summaryEl = rankComparison ? (
    <div className="text-[10px] leading-tight sm:text-xs">
      <CalibratedSummary canonical={canonicalRating ?? null} rank={rankComparison} compact />
    </div>
  ) : null;

  // Toggle attendance using mutation
  const toggleAttendance = () => {
    if (attendanceMutation.isPending) return;

    const previousAttendance = localAttendance; // Capture BEFORE optimistic update

    // Optimistically update local state
    setLocalAttendance(
      previousAttendance ? null : ({ id: "optimistic", showId: setlist.show.id, userId: "" } as Attendance),
    );

    attendanceMutation.mutate(
      { showId: setlist.show.id, currentAttendance: previousAttendance },
      {
        onSuccess: (result) => {
          setLocalAttendance(result.attendance);
          if (result.isAttending) {
            setIsAttendanceAnimating(true);
            // Clear any existing timeout and set new one
            if (attendanceAnimationTimeoutRef.current) clearTimeout(attendanceAnimationTimeoutRef.current);
            attendanceAnimationTimeoutRef.current = setTimeout(() => setIsAttendanceAnimating(false), 600);
          }
        },
        onError: () => {
          // Revert on error using captured previous value
          setLocalAttendance(previousAttendance);
        },
      },
    );
  };

  // Sits on the header's first line, beside the show date, rather than next to
  // the rating badge. Attendance and rating are different questions, and putting
  // them shoulder to shoulder made the row a contest between two bordered chips —
  // worst on a profile, where every show is attended. Here the badge owns the
  // right edge alone.
  const attendanceButton = (
    <button
      type="button"
      onClick={toggleAttendance}
      disabled={attendanceMutation.isPending}
      // Semantic hook for "the viewer marked this show attended", so tests don't
      // have to recognize the state by pattern-matching styling classes that are
      // free to change. Mirrors `data-rated` on the rating badge.
      data-attended={isAttending}
      className={cn(
        "flex items-center justify-center gap-1 px-2 h-6 sm:px-3 sm:h-8 rounded-md",
        "shrink-0 whitespace-nowrap",
        ROW_CHIP_HOVER,
        isAttending ? ATTENDED_CHROME : UNATTENDED_CHROME,
        isAttendanceAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
        attendanceMutation.isPending && "opacity-50",
      )}
    >
      <Check
        className={cn("h-3.5 w-3.5 sm:h-4 sm:w-4", isAttending ? "text-green-500" : "text-content-text-tertiary")}
      />
      {/*
       * The label stays neutral in both states. It was the single heaviest
       * element in the row — brightest colour and most ink — which put a fact
       * the green check already states above the rating it sits beside. Green
       * now lives only on the check and the chrome, which also leaves the
       * button speaking one green rather than two.
       */}
      <span className="text-sm font-medium hidden sm:inline text-content-text-tertiary">
        {isAttending ? "Saw it" : "Saw it?"}
      </span>
    </button>
  );

  return (
    <Card className="relative overflow-hidden">
      <CardHeader
        data-testid="setlist-card-header"
        onClick={
          collapsible
            ? (e) => {
                // Ignore clicks originating from interactive descendants so links
                // navigate and buttons fire without collapsing the card.
                if ((e.target as HTMLElement).closest("a, button")) return;
                setIsOpen((v) => !v);
                setHasMountedBody(true);
              }
            : undefined
        }
        className={cn(
          "relative z-10 px-3 md:px-6 border-b",
          collapsible ? "py-1 md:py-1 cursor-pointer" : "py-3 md:py-5",
          notForStats && "opacity-60 text-content-text-tertiary",
        )}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-lg md:text-2xl font-medium">
              <Link
                to={setlist.show.slug ? `/shows/${setlist.show.slug}` : `/shows`}
                // Reserve a column wide enough for the longest date this renders
                // (`12/30/2025` — the header has no @container/datecell, so it's
                // always the full M/D/YYYY), so the attendance button beside it
                // lands on the same vertical line in every row instead of sliding
                // with the date's length.
                //
                // `ch` rather than a px/rem value: this text renders in the
                // system font stack, so its metrics differ per platform, and it
                // scales text-lg → text-2xl at the md breakpoint. A fixed length
                // would need re-measuring on every OS and duplicating per
                // breakpoint; `ch` is defined against the font actually in use,
                // so one value covers both. 9ch clears the widest date with a few
                // px to spare at both sizes.
                //
                // `min-w`, not `w`: an unexpectedly wide date pushes the row out
                // rather than overflowing. And not a container query — ShowDate
                // documents that `container-type: inline-size` collapses it and
                // breaks the date character-by-character.
                className="text-brand-primary hover:text-brand-secondary transition-colors shrink-0 min-w-[9ch]"
              >
                <ShowDate date={setlist.show.date} />
              </Link>
              {user && attendanceButton}
              <AnniversaryBadge showDate={setlist.show.date} />
              {notForStats && (
                <Badge
                  variant="outline"
                  className="border-content-text-tertiary/40 bg-content-text-tertiary/10 text-content-text-tertiary text-[11px] font-semibold px-2 py-0"
                >
                  Not for stats
                </Badge>
              )}
            </div>
            <div className="text-base md:text-xl text-content-text-primary">
              <Link to={`/venues/${setlist.venue.slug}`} className="hover:text-brand-secondary transition-colors">
                {setlist.venue.name} - {formatVenueLocation(setlist.venue)}
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <RatingBadgeButton
                rateableId={setlist.show.id}
                rateableType="Show"
                showSlug={setlist.show.slug}
                initialRating={displayedRating}
                ratingsCount={displayedCount}
                userRating={user ? resolvedUserRating : null}
                isAuthenticated={!!user}
              />
              {summaryEl}
            </div>
            <div className="pr-2 sm:pr-3">
              <ShowExternalBadges
                sources={externalSources ?? {}}
                photosHref={setlist.show.slug ? `/shows/${setlist.show.slug}#photos` : undefined}
                photosCount={setlist.show.showPhotosCount}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <div
        data-testid="setlist-card-body"
        aria-hidden={collapsible && !isOpen}
        className={cn(
          collapsible && "grid transition-[grid-template-rows] duration-300 ease-out",
          collapsible && (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"),
        )}
      >
        <div className={cn(collapsible && "overflow-hidden")}>
          {hasMountedBody && (
            <CardContent className="relative z-10 px-3 py-3 md:px-6 md:py-5">
              <RockOperaAnnotations performances={setlist.rockOperaPerformances} />
              <ShowLineupNote
                notes={deriveShowLineupNotes(
                  setlist.show.date,
                  setlist.lineup,
                  setlist.trackMusicianDeltas,
                  setlist.sets.flatMap((set) => set.tracks).map((track) => track.id),
                )}
              />
              {setlist.show.notes && (
                <div
                  className="mb-4 text-sm text-content-text-secondary italic border-l pl-3 py-1"
                  dangerouslySetInnerHTML={{ __html: setlist.show.notes }}
                />
              )}

              {view === "gap-chart" ? (
                <div className="space-y-2">
                  <SetlistViewControl
                    view={view}
                    onChange={changeView}
                    summary={catalogSummary}
                    showPersonal={Boolean(user)}
                  />
                  <SetlistTable
                    showSlug={setlist.show.slug ?? ""}
                    showDate={setlist.show.date}
                    tracks={setlist.sets.flatMap((s) => s.tracks)}
                  />
                </div>
              ) : view === "personal" && user ? (
                <div className="space-y-2">
                  <SetlistViewControl view={view} onChange={changeView} summary={personalSummaryView} showPersonal />
                  <SetlistTablePersonal
                    tracks={setlist.sets.flatMap((s) => s.tracks)}
                    showSlug={setlist.show.slug ?? ""}
                    showDate={setlist.show.date}
                    onSummaryChange={setPersonalSummary}
                  />
                </div>
              ) : (
                <>
                  <SetlistFlow setlist={setlist} />
                  <div className="mt-4">
                    <SetlistViewControl
                      view={view}
                      onChange={changeView}
                      summary={catalogSummary}
                      showPersonal={Boolean(user)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          )}
        </div>
      </div>
    </Card>
  );
}

export const SetlistCard = memo(SetlistCardComponent);
