import type { SongAuthor } from "@bip/domain";
import { Link } from "react-router-dom";

/**
 * Links a song's author to their page: the musician page when the author is
 * linked to a musician, otherwise the author page (which lists their songs).
 * The single source of truth for author link targets across the app.
 */
export function AuthorLink({ author, className }: { author: SongAuthor; className?: string }) {
  const to = author.musicianSlug ? `/musicians/${author.musicianSlug}` : `/authors/${author.slug}`;
  return (
    <Link to={to} className={className}>
      {author.name}
    </Link>
  );
}

/** Comma-separated list of linked authors, sharing one link style. */
export function AuthorLinks({ authors, className }: { authors: SongAuthor[]; className?: string }) {
  return (
    <>
      {authors.map((author, index) => (
        <span key={author.id}>
          {index > 0 && ", "}
          <AuthorLink author={author} className={className} />
        </span>
      ))}
    </>
  );
}
