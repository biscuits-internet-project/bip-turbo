import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  // Root index route
  index("routes/_index.tsx"),

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
  ]),

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
      route(":slug", "routes/shows/$slug.tsx"),
      route("top-rated", "routes/shows/top-rated.tsx"),
      route("tour-dates", "routes/shows/tour-dates.tsx"),
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
    route("attendances", "routes/api/attendances.tsx"),
  ]),

  // Health check route
  route("healthcheck", "routes/healthcheck.tsx"),
] satisfies RouteConfig;
