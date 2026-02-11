import type { Author } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

type AuthorWithSongCount = Author & { songCount?: number };

export const authorColumns: ColumnDef<AuthorWithSongCount>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
        >
          Name
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const author = row.original;
      return (
        <Link
          to={`/admin/authors/${author.slug}/edit`}
          className="text-brand-primary hover:text-brand-secondary font-medium"
        >
          {author.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "songCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
        >
          Songs
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.original.songCount ?? 0;
      return (
        <span className="text-content-text-primary font-semibold">
          {count}
        </span>
      );
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
        >
          Slug
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className="text-content-text-secondary font-mono text-sm">{row.original.slug}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
        >
          Created
          {getSortIcon(column.getIsSorted())}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className="text-content-text-secondary">{formatDate(row.original.createdAt)}</span>;
    },
  },
];
