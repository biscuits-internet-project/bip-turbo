import type { Musician, TrackMusicianDelta } from "@bip/domain";
import { Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { InstrumentSearch } from "~/components/musician/instrument-search";
import { MusicianSearch } from "~/components/musician/musician-search";
import { Button } from "~/components/ui/button";
import { GlassSelect } from "~/components/ui/glass-select";
import { formLabelClass } from "~/lib/form-styles";
import type { TrackPerformerDelta } from "./use-track-api";

/** One editable performer row. `uid` keys the row across edits; `autoOpen`
 *  focuses a freshly-added row's musician picker. */
export interface PerformerRow {
  uid: string;
  musicianId: string;
  present: boolean;
  instrumentIds: string[];
  autoOpen?: boolean;
}

const STATUS_OPTIONS = [
  { value: "present", label: "Also played" },
  { value: "out", label: "Sat out" },
];

/** Seed editor rows from the track's saved domain deltas. */
export function deltasToRows(deltas: TrackMusicianDelta[]): PerformerRow[] {
  return deltas.map((delta, index) => ({
    uid: `seed-${index}`,
    musicianId: delta.musician.id,
    present: delta.present,
    instrumentIds: delta.instruments.map((instrument) => instrument.id),
  }));
}

/** Convert editor rows to the performers-endpoint payload: drop draft rows with
 *  no musician, and strip instruments from a sat-out (it played nothing). */
export function rowsToDeltas(rows: PerformerRow[]): TrackPerformerDelta[] {
  return rows
    .filter((row) => row.musicianId)
    .map((row) => ({
      musicianId: row.musicianId,
      present: row.present,
      instrumentIds: row.present ? row.instrumentIds : [],
    }));
}

interface TrackPerformerEditorProps {
  rows: PerformerRow[];
  onChange: (rows: PerformerRow[]) => void;
}

/**
 * The "Performer changes" section of the track edit form: repeatable rows that
 * capture per-track sit-ins ("Also played") and sat-outs against the show
 * lineup. Controlled — the parent (`TrackManager`) owns the rows and saves them
 * through the performers endpoint when the track is saved. Picking a musician
 * pre-fills their default instrument so the common sit-in is one click.
 */
export function TrackPerformerEditor({ rows, onChange }: TrackPerformerEditorProps) {
  const nextUid = useRef(0);
  const makeUid = () => `new-${nextUid.current++}`;

  // Selecting a musician fires onValueChange (set id) and onItemChange (prefill
  // instrument) synchronously. Both read the same `rows` prop, so without a ref
  // the second onChange would clobber the first. The ref composes them the way
  // a functional setState would.
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const commit = (next: PerformerRow[]) => {
    rowsRef.current = next;
    onChange(next);
  };

  const updateRow = (uid: string, change: (row: PerformerRow) => PerformerRow) =>
    commit(rowsRef.current.map((row) => (row.uid === uid ? change(row) : row)));

  const setMusician = (uid: string, musicianId: string | null) =>
    updateRow(uid, (row) => ({ ...row, musicianId: musicianId ?? "" }));

  // Only seed a default instrument on an empty sit-in row, so changing a
  // musician never clobbers an instrument an admin set deliberately.
  const prefillInstrument = (uid: string, musician: Musician | null) => {
    if (!musician?.defaultInstrumentId) return;
    const defaultInstrumentId = musician.defaultInstrumentId;
    updateRow(uid, (row) =>
      row.present && row.instrumentIds.length === 0 ? { ...row, instrumentIds: [defaultInstrumentId] } : row,
    );
  };

  const setPresent = (uid: string, present: boolean) => updateRow(uid, (row) => ({ ...row, present }));

  const replaceInstrument = (uid: string, instrumentIndex: number, instrumentId: string | null) =>
    updateRow(uid, (row) => {
      const next = instrumentId
        ? row.instrumentIds.map((id, i) => (i === instrumentIndex ? instrumentId : id))
        : row.instrumentIds.filter((_, i) => i !== instrumentIndex);
      return { ...row, instrumentIds: next };
    });

  const addInstrument = (uid: string, instrumentId: string | null) => {
    if (!instrumentId) return;
    updateRow(uid, (row) => ({ ...row, instrumentIds: [...row.instrumentIds, instrumentId] }));
  };

  const addRow = () =>
    commit([...rowsRef.current, { uid: makeUid(), musicianId: "", present: true, instrumentIds: [], autoOpen: true }]);
  const removeRow = (uid: string) => commit(rowsRef.current.filter((row) => row.uid !== uid));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={formLabelClass}>Performer changes</span>
        <Button type="button" variant="secondary" size="sm" aria-label="Add performer" onClick={addRow}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-content-text-tertiary">No sit-ins or sat-outs for this track.</p>
      ) : (
        <ul className="space-y-2 sm:space-y-1.5">
          {rows.map((row) => (
            <li
              key={row.uid}
              className="flex flex-wrap items-center gap-1.5 rounded-md border border-glass-border/30 p-2 sm:rounded-none sm:border-0 sm:p-0"
            >
              <MusicianSearch
                value={row.musicianId || null}
                onValueChange={(id) => setMusician(row.uid, id)}
                onItemChange={(musician) => prefillInstrument(row.uid, musician)}
                allowCreate
                autoOpen={row.autoOpen}
                className="h-8 w-full sm:w-48"
              />
              <GlassSelect
                value={row.present ? "present" : "out"}
                onValueChange={(value) => setPresent(row.uid, value === "present")}
                options={STATUS_OPTIONS}
                ariaLabel="Performer status"
                className="h-8 w-full sm:w-32"
              />
              {row.present && row.musicianId && (
                <>
                  {row.instrumentIds.map((instrumentId, instrumentIndex) => (
                    <InstrumentSearch
                      key={instrumentId}
                      value={instrumentId}
                      onValueChange={(id) => replaceInstrument(row.uid, instrumentIndex, id)}
                      allowCreate
                      className="h-8 w-full sm:w-36"
                    />
                  ))}
                  <InstrumentSearch
                    value={null}
                    onValueChange={(id) => addInstrument(row.uid, id)}
                    allowCreate
                    placeholder="+ instrument"
                    className="h-8 w-full sm:w-32"
                  />
                </>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove performer"
                onClick={() => removeRow(row.uid)}
                className="ml-auto h-8 w-8 shrink-0 sm:ml-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
