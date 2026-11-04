import { type ArchiveDotOrgRecording, pickPrimaryArchiveRecording } from "@bip/domain";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import ArchiveMusicPlayer from "~/components/player";
import { ShowMoreList } from "~/components/ui/show-more-list";
import { cn, formatDateLong } from "~/lib/utils";
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
  return addedDate ? formatDateLong(addedDate) : null;
}

/**
 * Moves the primary recording to the front, leaving the rest in their
 * original order, so the collapsed list preview always includes the tape the
 * player below is loaded with.
 */
function primaryFirst(
  items: ArchiveDotOrgRecording[],
  primary: ArchiveDotOrgRecording | null,
): ArchiveDotOrgRecording[] {
  if (!primary) return items;
  return [primary, ...items.filter((recording) => recording.identifier !== primary.identifier)];
}

/**
 * Lists the archive.org recordings for a show date (a few at first, the rest
 * behind a "Show N more" toggle, since a date can have a dozen tapes) and
 * embeds the ArchiveMusicPlayer for the ranked primary. The list + player
 * share one card (rather than being two separate cards) so users immediately
 * see that "Other recordings" are alternate tapes for the same show as the
 * one playing. The primary pick is derived from the recordings themselves so
 * callers only need to pass the raw list, and it is listed first so it is
 * never hidden.
 */
export function ArchiveRecordingsCard({ items }: ArchiveRecordingsCardProps) {
  if (items.length === 0) return null;
  const primary = pickPrimaryArchiveRecording(items);
  return (
    <ExternalSourceCard faviconDomain="archive.org" title="Archive.org">
      <div className="space-y-3">
        <ShowMoreList
          className="space-y-2 pl-6"
          items={primaryFirst(items, primary)}
          getKey={(recording) => recording.identifier}
          renderItem={(recording) => {
            const isPrimary = primary?.identifier === recording.identifier;
            const addedOn = formatAddedOn(recording.addedDate);
            return (
              <>
                <a
                  href={recording.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-secondary transition-colors block"
                >
                  {recording.identifier}
                  {isPrimary && items.length > 1 && (
                    <span className="ml-2 text-xs text-content-text-tertiary">(in player below)</span>
                  )}
                </a>
                {recording.source && <p className="text-xs text-content-text-tertiary truncate">{recording.source}</p>}
                {addedOn && <p className="text-xs text-content-text-tertiary">added {addedOn}</p>}
              </>
            );
          }}
        />
        {primary && <CollapsiblePlayer identifier={primary.identifier} />}
      </div>
    </ExternalSourceCard>
  );
}

/**
 * Wraps the embedded archive.org player behind a click-to-expand toggle.
 * Starts collapsed on every viewport because the player is heavy (iframe
 * + autoload behavior) and most visitors don't engage with it; opening it
 * is a deliberate "I want to listen" action.
 */
function CollapsiblePlayer({ identifier }: { identifier: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pt-3 border-t border-white/5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="w-full flex items-center justify-between text-sm font-medium text-content-text-secondary hover:text-content-text-primary transition-colors"
      >
        <span>{open ? "Hide player" : "Play recording"}</span>
        {/* Matches the app's disclosure convention: ▶ when closed, ▼ when open. */}
        <ChevronDown className={cn("h-4 w-4 transition-transform", !open && "-rotate-90")} />
      </button>
      {open && (
        <div className="mt-3">
          <ArchiveMusicPlayer identifier={identifier} bare />
        </div>
      )}
    </div>
  );
}
