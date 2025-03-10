import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/venues": {};
  "/venues/:slug": {
    "slug": string;
  };
  "/venues/new": {};
  "/venues/:slug/edit": {
    "slug": string;
  };
  "/resources": {};
  "/resources/band-history": {};
  "/resources/chemical-warfare-brigade": {};
  "/resources/hot-air-balloon": {};
  "/resources/media": {};
  "/resources/mixes": {};
  "/resources/movie-scores": {};
  "/resources/music": {};
  "/resources/perfume": {};
  "/resources/side-projects": {};
  "/resources/think-tank": {};
  "/resources/tractorbeam": {};
  "/resources/touchdowns": {};
  "/auth/login": {};
  "/auth/register": {};
  "/auth/callback": {};
  "/auth/logout": {};
  "/auth/forgot-password": {};
  "/blog": {};
  "/blog/:slug": {
    "slug": string;
  };
  "/shows": {};
  "/shows/:slug": {
    "slug": string;
  };
  "/shows/top-rated": {};
  "/shows/tour-dates": {};
  "/songs": {};
  "/songs/:slug": {
    "slug": string;
  };
  "/songs/new": {};
  "/songs/:slug/edit": {
    "slug": string;
  };
  "/api/reviews": {};
  "/api/ratings": {};
  "/api/attendances": {};
  "/healthcheck": {};
};