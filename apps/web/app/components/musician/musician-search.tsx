import type { Musician } from "@bip/domain";
import { type EntityPickerProps, EntitySearch } from "~/components/ui/entity-search";

/**
 * Musician picker for the show lineup and per-track performer editors. With
 * allowCreate it lets admins add a guest who isn't on file yet.
 */
export function MusicianSearch(props: EntityPickerProps & { onItemChange?: (item: Musician | null) => void }) {
  return <EntitySearch<Musician> resource="musicians" noneLabel="No Musician" itemLabel={(m) => m.name} {...props} />;
}
