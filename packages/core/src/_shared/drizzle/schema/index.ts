export * from "./annotations";
export * from "./attendances";
export * from "./authors";
export * from "./bands";
export * from "./blog-posts";
export * from "./comments";
export * from "./favorites";
export * from "./likes";
export * from "./ratings";
export * from "./reviews";
export * from "./show-photos";
export * from "./show-youtubes";
export * from "./shows";
export * from "./songs";
export * from "./tracks";
export * from "./users";
export * from "./venues";

// Re-export all tables and relations
import { annotations, annotationsRelations } from "./annotations";
import { attendances, attendancesRelations } from "./attendances";
import { authors, authorsRelations } from "./authors";
import { bands, bandsRelations } from "./bands";
import { blogPosts, blogPostsRelations } from "./blog-posts";
import { comments, commentsRelations } from "./comments";
import { favorites, favoritesRelations } from "./favorites";
import { likes, likesRelations } from "./likes";
import { ratings, ratingsRelations } from "./ratings";
import { reviews, reviewsRelations } from "./reviews";
import { showPhotos, showPhotosRelations } from "./show-photos";
import { showYoutubes, showYoutubesRelations } from "./show-youtubes";
import { shows, showsRelations } from "./shows";
import { songs, songsRelations } from "./songs";
import { tracks, tracksRelations } from "./tracks";
import { users, usersRelations } from "./users";
import { venues, venuesRelations } from "./venues";

// Combine all tables and relations
export const schema = {
  annotations,
  attendances,
  authors,
  bands,
  blogPosts,
  comments,
  favorites,
  likes,
  ratings,
  reviews,
  showPhotos,
  showYoutubes,
  shows,
  songs,
  tracks,
  users,
  venues,
  ...annotationsRelations,
  ...attendancesRelations,
  ...authorsRelations,
  ...bandsRelations,
  ...blogPostsRelations,
  ...commentsRelations,
  ...favoritesRelations,
  ...likesRelations,
  ...ratingsRelations,
  ...reviewsRelations,
  ...showPhotosRelations,
  ...showYoutubesRelations,
  ...showsRelations,
  ...songsRelations,
  ...tracksRelations,
  ...usersRelations,
  ...venuesRelations,
};
