import type { Attendance, Rating, Setlist, SetlistLight } from "@bip/domain";
import { Check } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RatingBadgeButton } from "~/components/rating/rating-badge-button";
import { ShowDate } from "~/components/show-date";
import { NoteworthyMarker } from "~/components/track/noteworthy-marker";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { useSession } from "~/hooks/use-session";
import { useAttendanceMutation } from "~/hooks/use-show-user-data";
import { cn } from "~/lib/utils";
import { AnniversaryBadge } from "./anniversary-badge";
import { RockOperaAnnotations } from "./rock-opera-annotations";
import { SetlistTable } from "./setlist-table";
import { SetlistTablePersonal } from "./setlist-table-personal";
import { SetlistViewControl, type SetlistViewSummary } from "./setlist-view-control";
import { ShowExternalBadges, type ShowExternalSources } from "./show-external-badges";
import { TrackRatingOverlay } from "./track-rating-overlay";

export type SetlistView = "setlist" | "gap-chart" | "personal";

interface SetlistCardProps {
  setlist: Setlist | SetlistLight;
  userAttendance: Attendance | null;
  userRating: Rating | number | null;
  showRating: number | null;
  externalSources?: ShowExternalSources;
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
  externalSources,
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

  // Resolve the user's rating from either of the supported prop shapes
  // (a Rating object or a bare number) into a single value for the badge.
  const resolvedUserRating = typeof userRating === "number" ? userRating : (userRating?.value ?? null);
  const displayedRating = showRating ?? setlist.show.averageRating ?? null;
  const displayedCount = setlist.show.ratingsCount ?? null;

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

  // Create a map to store unique annotations by description
  const uniqueAnnotations = new Map<string, { index: number; desc: string }>();

  // Create a map of trackId to array of annotation indices for quick lookup
  const trackAnnotationMap = new Map<string, number[]>();

  // Process annotations in order of tracks in the setlist
  let annotationIndex = 1;

  // Create a flat array of all tracks in order
  const allTracks = [];
  for (const set of setlist.sets) {
    for (const track of set.tracks) {
      allTracks.push(track);
    }
  }

  // First pass: identify all unique annotations and assign indices in order of appearance
  for (const track of allTracks) {
    // Get annotations for this track
    const trackAnnotations = setlist.annotations.filter((a) => a.trackId === track.id);
    const trackIndices: number[] = [];

    for (const annotation of trackAnnotations) {
      if (annotation.desc) {
        // If this description hasn't been seen before, assign a new index
        if (!uniqueAnnotations.has(annotation.desc)) {
          uniqueAnnotations.set(annotation.desc, {
            index: annotationIndex++,
            desc: annotation.desc,
          });
        }

        // Add this annotation index to the track's indices array
        const index = uniqueAnnotations.get(annotation.desc)?.index;
        if (index) {
          trackIndices.push(index);
        }
      }
    }

    // Map this track to all its annotation indices
    if (trackIndices.length > 0) {
      trackAnnotationMap.set(track.id, trackIndices);
    }
  }

  // Convert the unique annotations map to an array for display
  // Sort by index to maintain the order they were encountered
  const orderedAnnotations = Array.from(uniqueAnnotations.values()).sort((a, b) => a.index - b.index);

  return (
    <Card className="card-premium relative overflow-hidden">
      <CardHeader
        data-testid="setlist-card-header"
        onClick={
          collapsible
            ? (e) => {
                // Ignore clicks originating from interactive descendants so links
                // navigate and buttons fire without collapsing the card.
                if ((e.target as HTMLElement).closest("a, button")) return;
                setIsOpen((v) => !v);
              }
            : undefined
        }
        className={cn(
          "relative z-10 px-3 md:px-6 border-b border-glass-border/30",
          collapsible ? "py-1 md:py-1 cursor-pointer" : "py-3 md:py-5",
        )}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-lg md:text-2xl font-medium">
              <Link
                to={setlist.show.slug ? `/shows/${setlist.show.slug}` : `/shows`}
                className="text-brand-primary hover:text-brand-secondary transition-colors"
              >
                <ShowDate date={setlist.show.date} />
              </Link>
              <AnniversaryBadge showDate={setlist.show.date} />
            </div>
            <div className="text-base md:text-xl text-content-text-primary">
              <Link to={`/venues/${setlist.venue.slug}`} className="hover:text-brand-secondary transition-colors">
                {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {user && (
              <div className="flex items-center gap-2">
                {/* Attendance badge - clickable to toggle */}
                <button
                  type="button"
                  onClick={toggleAttendance}
                  disabled={attendanceMutation.isPending}
                  className={cn(
                    "flex items-center justify-center gap-1 px-2 h-6 sm:px-3 sm:h-8 rounded-md transition-all",
                    "shrink-0 whitespace-nowrap",
                    "hover:brightness-110 cursor-pointer",
                    isAttending
                      ? "bg-green-500/10 border border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
                      : "glass-secondary border border-dashed border-glass-border hover:border-green-500/30",
                    isAttendanceAnimating && "animate-[avg-rating-update_0.5s_ease-out]",
                    attendanceMutation.isPending && "opacity-50",
                  )}
                >
                  <Check
                    className={cn(
                      "h-3.5 w-3.5 sm:h-4 sm:w-4",
                      isAttending ? "text-green-500" : "text-content-text-tertiary",
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:inline",
                      isAttending ? "text-green-400" : "text-content-text-secondary",
                    )}
                  >
                    {isAttending ? "Saw it" : "Saw it?"}
                  </span>
                </button>

                <RatingBadgeButton
                  rateableId={setlist.show.id}
                  rateableType="Show"
                  showSlug={setlist.show.slug}
                  initialRating={displayedRating}
                  ratingsCount={displayedCount}
                  userRating={resolvedUserRating}
                  isAuthenticated
                />
              </div>
            )}
            {!user && (
              <RatingBadgeButton
                rateableId={setlist.show.id}
                rateableType="Show"
                showSlug={setlist.show.slug}
                initialRating={displayedRating}
                ratingsCount={displayedCount}
                userRating={null}
                isAuthenticated={false}
              />
            )}
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
          <CardContent className="relative z-10 px-3 py-3 md:px-6 md:py-5">
            <RockOperaAnnotations performances={setlist.rockOperaPerformances} />
            {setlist.show.notes && (
              <div
                className="mb-4 text-sm text-content-text-secondary italic border-l border-glass-border pl-3 py-1"
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
                <SetlistTable showSlug={setlist.show.slug ?? ""} tracks={setlist.sets.flatMap((s) => s.tracks)} />
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
                <div className="space-y-2 md:space-y-4">
                  {setlist.sets.map((set, setIndex) => (
                    <span
                      key={setlist.show.id + set.label}
                      className="inline-block w-full md:flex md:gap-4 md:items-baseline"
                    >
                      <span className="inline text-base font-medium text-content-text-tertiary">{set.label}</span>
                      <span className="inline ml-2 md:ml-0 md:flex-1">
                        {set.tracks.map((track, i) => (
                          <span key={track.id} className="inline">
                            <TrackRatingOverlay track={track}>
                              <span
                                className={cn(
                                  "relative text-brand-primary hover:text-brand-secondary hover:underline transition-colors text-base",
                                  track.allTimer && "font-medium",
                                )}
                              >
                                <NoteworthyMarker
                                  track={track}
                                  iconClassName="h-3 w-3 md:h-4 md:w-4 inline-block mr-1 transform -translate-y-0.5"
                                />
                                <Link to={`/songs/${track.song?.slug}`}>{track.song?.title}</Link>
                                {trackAnnotationMap.has(track.id) && (
                                  <sup className="text-brand-secondary ml-0.5 font-medium text-xs">
                                    {trackAnnotationMap.get(track.id)?.map((index, i) => (
                                      <span key={index} className={i > 0 ? "ml-1" : ""}>
                                        {index}
                                      </span>
                                    ))}
                                  </sup>
                                )}
                              </span>
                            </TrackRatingOverlay>
                            {i < set.tracks.length - 1 && (
                              <span className="text-content-text-secondary mx-1 font-medium text-base">
                                {track.segue ? " > " : ", "}
                              </span>
                            )}
                          </span>
                        ))}
                      </span>
                      {setIndex < setlist.sets.length - 1 && <span className="hidden"> </span>}
                    </span>
                  ))}
                </div>

                {orderedAnnotations.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-glass-border/30 space-y-2">
                    {orderedAnnotations.map((annotation) => (
                      <div key={`annotation-${annotation.index}`} className="text-sm text-content-text-secondary">
                        <sup className="text-brand-secondary">{annotation.index}</sup> {annotation.desc}
                      </div>
                    ))}
                  </div>
                )}
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
        </div>
      </div>
    </Card>
  );
}

export const SetlistCard = memo(SetlistCardComponent);
