import type { Author } from "@bip/domain";
import { type EntityPickerProps, EntitySearch } from "~/components/ui/entity-search";

/**
 * Author picker for blog posts and admin tools. The "All Authors" clear row
 * doubles as the "drop the author filter" option in the performance filters.
 * With allowCreate it lets admins add an author who isn't on file yet.
 */
export function AuthorSearch(props: EntityPickerProps) {
  return <EntitySearch<Author> resource="authors" noneLabel="All Authors" itemLabel={(a) => a.name} {...props} />;
}
