import type { ShowLineupMember } from "@bip/domain";
import { Link } from "react-router-dom";
import { sortLineup } from "~/lib/musicians-constants";

/**
 * The show's default performer lineup, shown below the setlist. Each member's
 * name links to their profile page, followed by the instruments they played.
 * Renders nothing when no lineup is recorded. Pass `bare` to render just the
 * member list (no heading or top divider) when the caller supplies its own
 * chrome — e.g. the admin edit page's read-only lineup card.
 */
export function ShowLineupSection({ lineup, bare = false }: { lineup: ShowLineupMember[]; bare?: boolean }) {
  if (lineup.length === 0) return null;

  const list = (
    <ul className="space-y-1">
      {sortLineup(lineup).map((member) => {
        const instruments = member.instruments.map((instrument) => instrument.name).join(", ");
        return (
          <li key={member.musician.id} className="text-sm text-content-text-secondary">
            <Link
              to={`/musicians/${member.musician.slug}`}
              className="text-brand-primary hover:text-brand-secondary hover:underline"
            >
              {member.musician.name}
            </Link>
            {instruments ? <span className="lowercase"> · {instruments}</span> : ""}
          </li>
        );
      })}
    </ul>
  );

  if (bare) return list;

  return (
    <div className="mt-6 pt-4 border-t border-glass-border/30">
      <h3 className="text-base font-medium text-content-text-tertiary mb-2">Lineup</h3>
      {list}
    </div>
  );
}
