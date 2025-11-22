import type { Show, Song } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";

// Enhanced Song type that includes show relationships for the data table
interface SongWithShows extends Song {
  firstPlayedShow?: Show | null;
  lastPlayedShow?: Show | null;
}

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getSortIcon = (sortState: false | "asc" | "desc") => {
  if (sortState === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
  if (sortState === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
  return <ArrowUpDown className="ml-2 h-4 w-4" />;
};

export const songsColumns: ColumnDef<SongWithShows>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
        >
          Song Title
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const song = row.original;
      return (
        <Link
          to={`/songs/${song.slug}`}
          className="text-brand-primary hover:text-brand-secondary font-medium whitespace-normal break-words"
        >
          {song.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "timesPlayed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
        >
          Plays
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const plays = row.original.timesPlayed;
      return plays > 0 ? (
        <span className="text-content-text-primary font-semibold whitespace-normal break-words">{plays}</span>
      ) : (
        <span className="text-content-text-tertiary text-sm italic whitespace-normal break-words">Never performed</span>
      );
    },
  },
  {
    accessorKey: "dateLastPlayed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
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
        <div className="text-base whitespace-normal break-words">
          {show?.slug ? (
            <Link
              to={`/shows/${show.slug}`}
              className="text-brand-primary hover:text-brand-secondary transition-colors whitespace-normal break-words"
            >
              <div className="whitespace-normal break-words">{formatDate(date)}</div>
              {show?.venue && (
                <div className="text-content-text-tertiary text-sm hover:text-content-text-secondary whitespace-normal break-words">
                  {show.venue.name}, {show.venue.city} {show.venue.state}
                </div>
              )}
            </Link>
          ) : (
            <div>
              <div className="text-content-text-secondary whitespace-normal break-words">{formatDate(date)}</div>
              {show?.venue && (
                <div className="text-content-text-tertiary text-sm whitespace-normal break-words">
                  {show.venue.name}, {show.venue.city} {show.venue.state}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <span className="text-content-text-tertiary text-sm whitespace-normal break-words">—</span>
      );
    },
  },
  {
    accessorKey: "dateFirstPlayed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
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
        <div className="text-base whitespace-normal break-words">
          {show?.slug ? (
            <Link
              to={`/shows/${show.slug}`}
              className="text-brand-primary hover:text-brand-secondary transition-colors whitespace-normal break-words"
            >
              <div className="whitespace-normal break-words">{formatDate(date)}</div>
              {show?.venue && (
                <div className="text-content-text-tertiary text-sm hover:text-content-text-secondary whitespace-normal break-words">
                  {show.venue.name}, {show.venue.city} {show.venue.state}
                </div>
              )}
            </Link>
          ) : (
            <div>
              <div className="text-content-text-secondary whitespace-normal break-words">{formatDate(date)}</div>
              {show?.venue && (
                <div className="text-content-text-tertiary text-sm whitespace-normal break-words">
                  {show.venue.name}, {show.venue.city} {show.venue.state}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <span className="text-content-text-tertiary text-sm whitespace-normal break-words">—</span>
      );
    },
  },
  {
    accessorKey: "yearlyPlayData",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
        >
          This Year
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const yearlyData = row.original.yearlyPlayData as Record<string, number>;
      const currentYear = new Date().getFullYear().toString();
      const thisYearPlays = yearlyData?.[currentYear] || 0;
      return thisYearPlays > 0 ? (
        <span className="text-content-text-primary font-medium whitespace-normal break-words">{thisYearPlays}</span>
      ) : (
        <span className="text-content-text-tertiary text-sm whitespace-normal break-words">—</span>
      );
    },
    sortingFn: (rowA, rowB) => {
      const currentYear = new Date().getFullYear().toString();
      const aData = rowA.original.yearlyPlayData as Record<string, number>;
      const bData = rowB.original.yearlyPlayData as Record<string, number>;
      const aPlays = aData?.[currentYear] || 0;
      const bPlays = bData?.[currentYear] || 0;
      return aPlays - bPlays;
    },
  },
];
