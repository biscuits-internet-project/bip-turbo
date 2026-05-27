import type { TrackLight } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import type { PersonalSetlistRow } from "~/lib/personal-setlist-columns";
import {
  createCountColumn,
  createGapColumn,
  createRatingColumn,
  createSetlistCommonColumns,
  createShowDateLinkColumn,
  type SetlistRatingContext,
} from "./setlist-common-columns";

export type PersonalSetlistTableRow = TrackLight & { personal: PersonalSetlistRow };

/**
 * Columns for the SetlistCard "personal gap chart" view. Order is
 * [Set, Track #, Song, Your Gap, Last Seen, Seen, Rating]. The first three
 * come from the shared `createSetlistCommonColumns` helper (with the song
 * link routed to the user's attended-filtered detail view); this factory
 * adds the user-history columns and the shared interactive Rating column.
 * "Last Seen" shows the user's most recent attended performance **strictly
 * before** the current show's date.
 */
export function createPersonalSetlistColumns(
  ctx?: Partial<SetlistRatingContext>,
): ColumnDef<PersonalSetlistTableRow, unknown>[] {
  const ratingCtx: SetlistRatingContext = {
    showSlug: ctx?.showSlug ?? "",
    userRatingMap: ctx?.userRatingMap ?? new Map(),
    isAuthenticated: ctx?.isAuthenticated ?? false,
  };
  return [
    ...createSetlistCommonColumns<PersonalSetlistTableRow>({ songLinkSearchParams: "attended=attended" }),
    createGapColumn<PersonalSetlistTableRow>({
      id: "yourGap",
      label: "Your Gap",
      weight: 0.8,
      state: (row) => row.personal.yourGap,
      debutLabel: "Your debut",
      thisShowLabel: "Earlier this show",
    }),
    createShowDateLinkColumn<PersonalSetlistTableRow>({
      id: "lastSeen",
      label: "Last Seen",
      accessor: (row) => row.personal.lastSeen,
      fixedWidth: "7.5rem",
      hideOnMobile: true,
    }),
    // "Seen Before" — attended performances strictly before this show.
    // Mobile-visible (it's been there since the personal view shipped);
    // the catalog peer "Played Before" hides on mobile instead.
    createCountColumn<PersonalSetlistTableRow>({
      id: "totalTimesSeen",
      accessor: (row) => row.personal.totalTimesSeen,
      label: ["Seen", "Before"],
      mobileFixedWidth: "3rem",
    }),
    createRatingColumn<PersonalSetlistTableRow>(ratingCtx),
  ];
}
