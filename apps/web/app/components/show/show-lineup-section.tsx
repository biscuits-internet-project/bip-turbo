import type { ShowLineupMember } from "@bip/domain";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "~/components/ui/card";
import { CollapsibleSection } from "~/components/ui/collapsible-section";
import { formatInstrumentNames } from "~/lib/instruments";
import type { ShowLineupNotes } from "~/lib/lineup-notes";
import { sortLineup } from "~/lib/musicians-constants";

/** Slugs of lineup members who deviate from the expected core lineup — a
 *  whole-show guest/sit-in, or a core member on a non-default instrument.
 *  Missing members aren't in the list, so they only drive the header indicator. */
function deviatingMemberSlugs(notes: ShowLineupNotes): Set<string> {
  return new Set([...notes.guests, ...notes.offInstrument].map((member) => member.slug));
}

/** True when anything about the lineup differs from the expected core lineup:
 *  a missing core member, a whole-show guest, or an off-instrument play. */
function hasDeviation(notes: ShowLineupNotes): boolean {
  return notes.missing.length > 0 || notes.guests.length > 0 || notes.offInstrument.length > 0;
}

/**
 * The show's default performer lineup, shown below the setlist as a card. Each
 * member's name links to their profile, followed by the instruments they
 * played. A sparkle marks any member who differs from the expected core lineup
 * (a sit-in, or a core member on an off-instrument), and a matching header
 * indicator surfaces that the lineup is non-standard while the card is
 * collapsed on mobile. The card starts collapsed on mobile (tap the header to
 * expand) and is always expanded at >= md.
 *
 * Renders nothing when no lineup is recorded. Pass `bare` to render just the
 * member list (no card, heading, or indicators) when the caller supplies its
 * own chrome — e.g. the admin edit page's read-only lineup card; `notes` is
 * ignored in that mode.
 */
export function ShowLineupSection({
  lineup,
  notes,
  bare = false,
}: {
  lineup: ShowLineupMember[];
  notes?: ShowLineupNotes;
  bare?: boolean;
}) {
  if (lineup.length === 0) return null;

  const deviating = !bare && notes ? deviatingMemberSlugs(notes) : null;

  const list = (
    <ul className="space-y-1">
      {sortLineup(lineup).map((member) => {
        const instruments = formatInstrumentNames(member.instruments);
        return (
          <li key={member.musician.id} className="flex items-center gap-1.5 text-sm text-content-text-secondary">
            <span>
              <Link
                to={`/musicians/${member.musician.slug}`}
                className="text-brand-primary hover:text-brand-secondary hover:underline"
              >
                {member.musician.name}
              </Link>
              {instruments ? <span className="lowercase"> · {instruments}</span> : ""}
            </span>
            {deviating?.has(member.musician.slug) && (
              <Sparkles data-testid="lineup-member-sparkle" className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
            )}
          </li>
        );
      })}
    </ul>
  );

  if (bare) return list;

  return (
    <Card className="card-premium relative overflow-hidden mt-4">
      <CollapsibleSection
        title="Lineup"
        titleAs="h3"
        titleClassName="text-base font-medium text-content-text-tertiary"
        headerExtra={
          notes && hasDeviation(notes) ? (
            <Sparkles data-testid="lineup-deviation-indicator" className="h-4 w-4 text-brand-primary" />
          ) : undefined
        }
        headerClassName="px-3 py-2 md:px-6 md:py-3"
        contentClassName="px-3 pb-3 pt-0 md:px-6 md:pb-5"
      >
        {list}
      </CollapsibleSection>
    </Card>
  );
}
