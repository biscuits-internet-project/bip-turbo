import type { Musician, ShowLineupMember } from "@bip/domain";
import { Edit2, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { InstrumentSearch } from "~/components/musician/instrument-search";
import { MusicianSearch } from "~/components/musician/musician-search";
import { ShowLineupSection } from "~/components/show/show-lineup-section";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MultiEntityPicker } from "~/components/ui/multi-entity-picker";
import { sortLineup } from "~/lib/musicians-constants";

interface LineupRow {
  uid: string;
  musicianId: string;
  instrumentIds: string[];
  autoOpen?: boolean;
}

interface ShowLineupManagerProps {
  showId: string;
  initialLineup: ShowLineupMember[];
}

/**
 * Admin lineup editor on the show edit page. Shows the lineup read-only using
 * the same component as the public show page, with an Edit toggle that swaps in
 * the picker-based editor for the whole set at once. Saves via
 * /api/shows/:showId/lineup, which returns the resolved lineup so the read-only
 * view refreshes without a second fetch. Picking a musician pre-fills their
 * default instrument so the common case is one click.
 */
export function ShowLineupManager({ showId, initialLineup }: ShowLineupManagerProps) {
  const [lineup, setLineup] = useState<ShowLineupMember[]>(initialLineup);
  const [editing, setEditing] = useState(false);
  const [rows, setRows] = useState<LineupRow[]>([]);
  const [saving, setSaving] = useState(false);
  const nextUid = useRef(0);
  const makeUid = () => String(nextUid.current++);

  const beginEdit = () => {
    // Seed rows in the same order the read-only view shows them.
    setRows(
      sortLineup(lineup).map((member) => ({
        uid: makeUid(),
        musicianId: member.musician.id,
        instrumentIds: member.instruments.map((instrument) => instrument.id),
      })),
    );
    setEditing(true);
  };

  const updateRow = (uid: string, change: (row: LineupRow) => LineupRow) => {
    setRows((prev) => prev.map((row) => (row.uid === uid ? change(row) : row)));
  };

  const setMusician = (uid: string, musicianId: string | null) => {
    updateRow(uid, (row) => ({ ...row, musicianId: musicianId ?? "" }));
  };

  // Only seed a default instrument when the row has none yet, so changing a
  // musician never clobbers an instrument an admin set deliberately.
  const prefillInstrument = (uid: string, musician: Musician | null) => {
    if (!musician?.defaultInstrumentId) return;
    const defaultInstrumentId = musician.defaultInstrumentId;
    updateRow(uid, (row) => (row.instrumentIds.length === 0 ? { ...row, instrumentIds: [defaultInstrumentId] } : row));
  };

  const replaceInstrument = (uid: string, instrumentIndex: number, instrumentId: string | null) => {
    updateRow(uid, (row) => {
      const next = instrumentId
        ? row.instrumentIds.map((id, i) => (i === instrumentIndex ? instrumentId : id))
        : row.instrumentIds.filter((_, i) => i !== instrumentIndex);
      return { ...row, instrumentIds: next };
    });
  };

  const addInstrument = (uid: string, instrumentId: string | null) => {
    if (!instrumentId) return;
    updateRow(uid, (row) => ({ ...row, instrumentIds: [...row.instrumentIds, instrumentId] }));
  };

  const addRow = () =>
    setRows((prev) => [...prev, { uid: makeUid(), musicianId: "", instrumentIds: [], autoOpen: true }]);
  const removeRow = (uid: string) => setRows((prev) => prev.filter((row) => row.uid !== uid));

  const save = async () => {
    setSaving(true);
    const loadingToast = toast.loading("Saving lineup...");
    const entries = rows
      .filter((row) => row.musicianId)
      .map((row) => ({ musicianId: row.musicianId, instrumentIds: row.instrumentIds }));
    try {
      const response = await fetch(`/api/shows/${showId}/lineup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      if (!response.ok) throw new Error("Save failed");
      const data = (await response.json()) as { lineup: ShowLineupMember[] };
      setLineup(data.lineup);
      setEditing(false);
      toast.success("Lineup saved", { id: loadingToast });
    } catch {
      toast.error("Failed to save lineup", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-base font-medium text-content-text-primary">Lineup</h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              aria-label="Edit lineup"
              onClick={beginEdit}
              className="h-8 w-8 p-0 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
          {lineup.length > 0 ? (
            <ShowLineupSection lineup={lineup} bare />
          ) : (
            <p className="text-sm text-content-text-tertiary">No lineup recorded yet.</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0 py-3">
        <CardTitle className="text-base text-content-text-primary">Edit lineup</CardTitle>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" aria-label="Add musician" onClick={addRow}>
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
          <Button type="button" variant="ghost" size="sm" aria-label="Cancel" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button type="button" variant="brand" size="sm" aria-label="Save lineup" onClick={save} disabled={saving}>
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 pb-3">
        <MultiEntityPicker
          rows={rows}
          onAdd={addRow}
          onRemove={removeRow}
          addAriaLabel="Add musician"
          removeAriaLabel="Remove musician"
          renderRow={(row) => (
            <>
              <MusicianSearch
                value={row.musicianId || null}
                onValueChange={(id) => setMusician(row.uid, id)}
                onItemChange={(musician) => prefillInstrument(row.uid, musician)}
                allowCreate
                autoOpen={row.autoOpen}
                className="h-8 w-full sm:w-48"
              />
              {row.musicianId &&
                row.instrumentIds.map((instrumentId, instrumentIndex) => (
                  <InstrumentSearch
                    key={instrumentId}
                    value={instrumentId}
                    onValueChange={(id) => replaceInstrument(row.uid, instrumentIndex, id)}
                    allowCreate
                    className="h-8 w-full sm:w-36"
                  />
                ))}
              {row.musicianId && (
                <InstrumentSearch
                  value={null}
                  onValueChange={(id) => addInstrument(row.uid, id)}
                  allowCreate
                  placeholder="+ instrument"
                  className="h-8 w-full sm:w-32"
                />
              )}
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}
