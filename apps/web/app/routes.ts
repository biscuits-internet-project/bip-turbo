import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  // Root index route
  index("routes/_index.tsx"),

  // Legal and info pages
  route("about", "routes/about.tsx"),
  route("terms", "routes/terms.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("community", "routes/community.tsx"),

  // Venues routes with layout
  layout("routes/venues/_layout.tsx", [
    ...prefix("venues", [
      index("routes/venues/index.tsx"),
      route(":slug", "routes/venues/$slug.tsx"),
      route("new", "routes/venues/new.tsx"),
      route(":slug/edit", "routes/venues/$slug.edit.tsx"),
    ]),
  ]),

  // Resources routes with layout
  layout("routes/resources/_layout.tsx", [
    ...prefix("resources", [
      index("routes/resources/_index.tsx"),
      route("band-history", "routes/resources/band-history.tsx"),
      route("chemical-warfare-brigade", "routes/resources/chemical-warfare-brigade.tsx"),
      route("hot-air-balloon", "routes/resources/hot-air-balloon.tsx"),
      route("media", "routes/resources/media.tsx"),
      route("mixes", "routes/resources/mixes.tsx"),
      route("movie-scores", "routes/resources/movie-scores.tsx"),
      route("music", "routes/resources/music.tsx"),
      route("perfume", "routes/resources/perfume.tsx"),
      route("side-projects", "routes/resources/side-projects.tsx"),
      route("think-tank", "routes/resources/think-tank.tsx"),
      route("tractorbeam", "routes/resources/tractorbeam.tsx"),
      route("touchdowns", "routes/resources/touchdowns.tsx"),
    ]),
  ]),

  // Auth routes
  ...prefix("auth", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
    route("callback", "routes/auth/callback.tsx"),
    route("logout", "routes/auth/logout.tsx"),
    route("forgot-password", "routes/auth/forgot-password.tsx"),
    route("reset-password", "routes/auth/reset-password.tsx"),
  ]),

  // Profile routes
  ...prefix("profile", [route("edit", "routes/profile/edit.tsx")]),

  // User profile routes
  ...prefix("users", [route(":username", "routes/users/$username.tsx")]),

  // Blog routes with layout
  layout("routes/blog/_layout.tsx", [
    ...prefix("blog", [
      index("routes/blog/_index.tsx"),
      route("new", "routes/blog/new.tsx"),
      route(":slug", "routes/blog/$slug.tsx"),
      route(":slug/edit", "routes/blog/$slug.edit.tsx"),
    ]),
  ]),

  // Shows routes with layout
  layout("routes/shows/_layout.tsx", [
    ...prefix("shows", [
      index("routes/shows/_index.tsx"),
      route("year/:year", "routes/shows/year/$year.tsx"),
      route(":slug", "routes/shows/$slug.tsx"),
      route("top-rated", "routes/shows/top-rated.tsx"),
      route("tour-dates", "routes/shows/tour-dates.tsx"),
      route("new", "routes/shows/new.tsx"),
      route(":slug/edit", "routes/shows/$slug.edit.tsx"),
    ]),
  ]),

  // Songs routes with layout
  layout("routes/songs/_layout.tsx", [
    ...prefix("songs", [
      index("routes/songs/_index.tsx"),
      route(":slug", "routes/songs/$slug.tsx"),
      route("new", "routes/songs/new.tsx"),
      route(":slug/edit", "routes/songs/$slug.edit.tsx"),
    ]),
  ]),

  ...prefix("api", [
    route("reviews", "routes/api/reviews.tsx"),
    route("ratings", "routes/api/ratings.tsx"),
    route("tracks/:trackId", "routes/api/tracks/$trackId.tsx"),
    route("attendances", "routes/api/attendances.tsx"),
    route("venues", "routes/api/venues.tsx"),
    route("venues/:id", "routes/api/venues/$id.tsx"),
    route("songs", "routes/api/songs.tsx"),
    route("songs/:id", "routes/api/songs/$id.tsx"),
    route("tracks", "routes/api/tracks.tsx"),
    route("tracks/reorder", "routes/api/tracks/reorder.tsx"),
    route("search", "routes/api/search.tsx"),
    route("search/feedback", "routes/api/search/feedback.tsx"),
    route("users", "routes/api/users.tsx"),
    route("contact", "routes/api/contact.tsx"),
    route("cron/:action", "routes/api/cron/$action.tsx"),
  ]),

  // Health check route
  route("healthcheck", "routes/healthcheck.tsx"),
] satisfies RouteConfig;
