import type { Instrument } from "@bip/domain";
import { type EntityPickerProps, EntitySearch } from "~/components/ui/entity-search";

/**
 * Instrument picker for the musician form and the lineup/track editors. With
 * allowCreate it lets admins add an instrument that isn't on file yet.
 */
export function InstrumentSearch(props: EntityPickerProps) {
  return (
    <EntitySearch<Instrument> resource="instruments" noneLabel="No Instrument" itemLabel={(i) => i.name} {...props} />
  );
}
