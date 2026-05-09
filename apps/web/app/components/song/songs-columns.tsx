import type { Show, Song } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";

interface SongWithShows extends Song {
  firstPlayedShow?: Show | null;
  lastPlayedShow?: Show | null;
}

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { ShowDate } from "~/components/show-date";
import { Button } from "~/components/ui/button";

const getSortIcon = (sortState: false | "asc" | "desc") => {
  // Arrow sits below the label on mobile (the header uses flex-col there) so
  // we drop the left margin in that layout and bring it back at sm+.
  const className = "ml-0 sm:ml-2 h-4 w-4";
  if (sortState === "asc") return <ArrowUp className={`${className} text-brand-primary`} />;
  if (sortState === "desc") return <ArrowDown className={`${className} text-brand-primary`} />;
  return <ArrowUpDown className={className} />;
};

interface GetSongsColumnsOptions {
  showFilteredPlays: boolean;
}

/**
 * Produces the column definitions for the /songs table. The "Filtered Plays"
 * column is inserted only when a filter scope is active (time range, toggles,
 * tab-level extraParams, etc.); when absent, "Plays" alone represents all-time
 * counts.
 */
export function getSongsColumns({ showFilteredPlays }: GetSongsColumnsOptions): ColumnDef<SongWithShows>[] {
  const titleColumn: ColumnDef<SongWithShows> = {
    accessorKey: "title",
    meta: { width: showFilteredPlays ? "30%" : "40%" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors whitespace-normal leading-tight flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2"
        >
          Song
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const song = row.original;
      return (
        <Link
          to={`/songs/${song.slug}`}
          className="inline-block min-w-[10ch] text-base text-brand-primary hover:text-brand-secondary font-medium [overflow-wrap:anywhere]"
        >
          {song.title}
        </Link>
      );
    },
  };

  const playsColumn: ColumnDef<SongWithShows> = {
    accessorKey: "timesPlayed",
    // When Filtered Plays is also visible there isn't room for both count
    // columns on mobile; the all-time count is the less specific of the
    // two so it drops out at narrow widths.
    meta: { width: "10%", hideOnMobile: showFilteredPlays },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors whitespace-normal leading-tight flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2"
        >
          Plays
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const plays = row.original.timesPlayed;
      return plays > 0 ? (
        <span className="text-content-text-primary font-semibold">{plays}</span>
      ) : (
        <span className="text-content-text-tertiary text-sm italic">Never performed</span>
      );
    },
  };

  const filteredPlaysColumn: ColumnDef<SongWithShows> = {
    accessorKey: "filteredTimesPlayed",
    meta: { width: "10%" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors whitespace-normal leading-tight flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2"
        >
          Filtered Plays
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const plays = row.original.filteredTimesPlayed ?? 0;
      return plays > 0 ? (
        <span className="text-content-text-primary font-medium">{plays}</span>
      ) : (
        <span className="text-content-text-tertiary text-sm">—</span>
      );
    },
    sortingFn: (rowA, rowB) => {
      const aFiltered = rowA.original.filteredTimesPlayed ?? 0;
      const bFiltered = rowB.original.filteredTimesPlayed ?? 0;
      if (aFiltered !== bFiltered) return aFiltered - bFiltered;
      // Same direction tiebreaker on all-time Plays — TanStack flips the
      // sign of the whole comparator for desc, so the secondary sort
      // automatically follows the primary direction.
      return rowA.original.timesPlayed - rowB.original.timesPlayed;
    },
  };

  const lastPlayedColumn: ColumnDef<SongWithShows> = {
    accessorKey: "dateLastPlayed",
    meta: { width: "25%" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors whitespace-normal leading-tight flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2"
        >
          Last Played
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.dateLastPlayed;
      const show = row.original.lastPlayedShow;
      return date ? (
        <div>
          {show?.slug ? (
            <Link
              to={`/shows/${show.slug}`}
              className="text-brand-primary hover:text-brand-secondary transition-colors"
            >
              <div>
                <ShowDate date={date} />
              </div>
              {show?.venue && (
                <div className="text-content-text-tertiary text-sm hover:text-content-text-secondary hidden sm:block">
                  {show.venue.name}, {show.venue.city} {show.venue.state}
                </div>
              )}
            </Link>
          ) : (
            <div>
              <div className="text-content-text-secondary">
                <ShowDate date={date} />
              </div>
              {show?.venue && (
                <div className="text-content-text-tertiary text-sm hidden sm:block">
                  {show.venue.name}, {show.venue.city} {show.venue.state}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <span className="text-content-text-tertiary text-sm">—</span>
      );
    },
  };

  const firstPlayedColumn: ColumnDef<SongWithShows> = {
    accessorKey: "dateFirstPlayed",
    meta: { width: "25%" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors whitespace-normal leading-tight flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2"
        >
          First Played
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.dateFirstPlayed;
      const show = row.original.firstPlayedShow;
      return date ? (
        <div>
          {show?.slug ? (
            <Link
              to={`/shows/${show.slug}`}
              className="text-brand-primary hover:text-brand-secondary transition-colors"
            >
              <div>
                <ShowDate date={date} />
              </div>
              {show?.venue && (
                <div className="text-content-text-tertiary text-sm hover:text-content-text-secondary hidden sm:block">
                  {show.venue.name}, {show.venue.city} {show.venue.state}
                </div>
              )}
            </Link>
          ) : (
            <div>
              <div className="text-content-text-secondary">
                <ShowDate date={date} />
              </div>
              {show?.venue && (
                <div className="text-content-text-tertiary text-sm hidden sm:block">
                  {show.venue.name}, {show.venue.city} {show.venue.state}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <span className="text-content-text-tertiary text-sm">—</span>
      );
    },
  };

  const columns: ColumnDef<SongWithShows>[] = [titleColumn, playsColumn];
  if (showFilteredPlays) columns.push(filteredPlaysColumn);
  columns.push(lastPlayedColumn, firstPlayedColumn);
  return columns;
}
