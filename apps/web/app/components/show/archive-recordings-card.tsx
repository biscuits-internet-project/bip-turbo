import { type ArchiveDotOrgRecording, pickPrimaryArchiveRecording } from "@bip/domain";
import ArchiveMusicPlayer from "~/components/player";
import { ExternalSourceCard } from "./external-source-card";

/**
 * Props for the Archive.org card.
 */
interface ArchiveRecordingsCardProps {
  /** All known recordings for the show date. Empty collapses the card so
   *  callers can pass the raw list without a gate. */
  items: ArchiveDotOrgRecording[];
}

function formatAddedOn(addedDate: string | undefined): string | null {
  if (!addedDate) return null;
  return new Date(addedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Lists every archive.org recording for a show date and embeds the
 * ArchiveMusicPlayer for the ranked primary. The list + player share one card
 * (rather than being two separate cards) so users immediately see that "Other
 * recordings" are alternate tapes for the same show as the one playing. The
 * primary pick is derived from the recordings themselves so callers only
 * need to pass the raw list.
 */
export function ArchiveRecordingsCard({ items }: ArchiveRecordingsCardProps) {
  if (items.length === 0) return null;
  const primary = pickPrimaryArchiveRecording(items);
  return (
    <ExternalSourceCard faviconDomain="archive.org" title="Archive.org">
      <div className="space-y-3">
        <ul className="space-y-2 pl-6">
          {items.map((recording) => {
            const isPrimary = primary?.identifier === recording.identifier;
            const addedOn = formatAddedOn(recording.addedDate);
            return (
              <li key={recording.identifier}>
                <a
                  href={recording.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-secondary hover:text-hover-accent transition-colors block"
                >
                  {recording.identifier}
                  {isPrimary && items.length > 1 && (
                    <span className="ml-2 text-xs text-content-text-tertiary">(in player below)</span>
                  )}
                </a>
                {recording.source && <p className="text-xs text-content-text-tertiary truncate">{recording.source}</p>}
                {addedOn && <p className="text-xs text-content-text-tertiary">added {addedOn}</p>}
              </li>
            );
          })}
        </ul>
        {primary && (
          <div className="pt-3 border-t border-white/5">
            <ArchiveMusicPlayer identifier={primary.identifier} bare />
          </div>
        )}
      </div>
    </ExternalSourceCard>
  );
}
