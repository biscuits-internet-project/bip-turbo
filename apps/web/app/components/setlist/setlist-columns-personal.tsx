import type { TrackLight } from "@bip/domain";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { SortableHeader } from "~/components/ui/sortable-header";
import type { PersonalSetlistRow } from "~/lib/personal-setlist-columns";
import {
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
    createSeenCountColumn(),
    createRatingColumn<PersonalSetlistTableRow>(ratingCtx),
  ];
}

/**
 * "Seen Before" column — count of attended performances strictly before
 * this show. Inline factory because no other column shares this shape.
 */
function createSeenCountColumn(): ColumnDef<PersonalSetlistTableRow, unknown> {
  const columnHelper = createColumnHelper<PersonalSetlistTableRow>();
  return columnHelper.accessor((row) => row.personal.totalTimesSeen, {
    id: "totalTimesSeen",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={
          <span className="flex flex-col items-start leading-tight">
            <span>Seen</span>
            <span>Before</span>
          </span>
        }
      />
    ),
    // Bounded content (1-3 digit count). Desktop fixedWidth holds the
    // stacked "Seen / Before" header + sort arrow on its own line below
    // without leaving any extra slack.
    meta: { fixedWidth: "4.5rem", mobileFixedWidth: "3rem" },
    enableSorting: true,
    sortingFn: "basic",
    sortDescFirst: false,
    cell: (info) => <span className="text-content-text-secondary tabular-nums">{info.getValue() as number}</span>,
  }) as ColumnDef<PersonalSetlistTableRow, unknown>;
}
