import { relations } from "drizzle-orm/relations";
import { shows, attendances, users, comments, tracks, annotations, blogPosts, favorites, ratings, showPhotos, showYoutubes, authors, songs, reviews, tags, taggings, bands, venues, likes } from "./schema";

export const attendancesRelations = relations(attendances, ({one}) => ({
	show: one(shows, {
		fields: [attendances.showId],
		references: [shows.id]
	}),
	user: one(users, {
		fields: [attendances.userId],
		references: [users.id]
	}),
}));

export const showsRelations = relations(shows, ({one, many}) => ({
	attendances: many(attendances),
	favorites: many(favorites),
	showPhotos: many(showPhotos),
	showYoutubes: many(showYoutubes),
	band: one(bands, {
		fields: [shows.bandId],
		references: [bands.id]
	}),
	venue: one(venues, {
		fields: [shows.venueId],
		references: [venues.id]
	}),
	tracks: many(tracks),
}));

export const usersRelations = relations(users, ({many}) => ({
	attendances: many(attendances),
	comments: many(comments),
	blogPosts: many(blogPosts),
	favorites: many(favorites),
	ratings: many(ratings),
	showPhotos: many(showPhotos),
	reviews: many(reviews),
	likes: many(likes),
}));

export const commentsRelations = relations(comments, ({one}) => ({
	user: one(users, {
		fields: [comments.userId],
		references: [users.id]
	}),
}));

export const annotationsRelations = relations(annotations, ({one}) => ({
	track: one(tracks, {
		fields: [annotations.trackId],
		references: [tracks.id]
	}),
}));

export const tracksRelations = relations(tracks, ({one, many}) => ({
	annotations: many(annotations),
	show: one(shows, {
		fields: [tracks.showId],
		references: [shows.id]
	}),
	song: one(songs, {
		fields: [tracks.songId],
		references: [songs.id]
	}),
}));

export const blogPostsRelations = relations(blogPosts, ({one}) => ({
	user: one(users, {
		fields: [blogPosts.userId],
		references: [users.id]
	}),
}));

export const favoritesRelations = relations(favorites, ({one}) => ({
	show: one(shows, {
		fields: [favorites.showId],
		references: [shows.id]
	}),
	user: one(users, {
		fields: [favorites.userId],
		references: [users.id]
	}),
}));

export const ratingsRelations = relations(ratings, ({one}) => ({
	user: one(users, {
		fields: [ratings.userId],
		references: [users.id]
	}),
}));

export const showPhotosRelations = relations(showPhotos, ({one}) => ({
	show: one(shows, {
		fields: [showPhotos.showId],
		references: [shows.id]
	}),
	user: one(users, {
		fields: [showPhotos.userId],
		references: [users.id]
	}),
}));

export const showYoutubesRelations = relations(showYoutubes, ({one}) => ({
	show: one(shows, {
		fields: [showYoutubes.showId],
		references: [shows.id]
	}),
}));

export const songsRelations = relations(songs, ({one, many}) => ({
	author: one(authors, {
		fields: [songs.authorId],
		references: [authors.id]
	}),
	tracks: many(tracks),
}));

export const authorsRelations = relations(authors, ({many}) => ({
	songs: many(songs),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	user: one(users, {
		fields: [reviews.userId],
		references: [users.id]
	}),
}));

export const taggingsRelations = relations(taggings, ({one}) => ({
	tag: one(tags, {
		fields: [taggings.tagId],
		references: [tags.id]
	}),
}));

export const tagsRelations = relations(tags, ({many}) => ({
	taggings: many(taggings),
}));

export const bandsRelations = relations(bands, ({many}) => ({
	shows: many(shows),
}));

export const venuesRelations = relations(venues, ({many}) => ({
	shows: many(shows),
}));

export const likesRelations = relations(likes, ({one}) => ({
	user: one(users, {
		fields: [likes.userId],
		references: [users.id]
	}),
}));