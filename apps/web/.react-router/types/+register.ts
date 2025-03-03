import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/resources/chemical-warfare-brigade": {};
  "/resources/hot-air-balloon": {};
  "/resources/side-projects": {};
  "/resources/band-history": {};
  "/resources/movie-scores": {};
  "/resources/tractorbeam": {};
  "/auth/forgot-password": {};
  "/resources/think-tank": {};
  "/resources/touchdowns": {};
  "/resources/perfume": {};
  "/resources": {};
  "/resources/media": {};
  "/resources/mixes": {};
  "/resources/music": {};
  "/auth/callback": {};
  "/auth/register": {};
  "/venues": {};
  "/shows": {};
  "/songs": {};
  "/venues/:slug": {
    "slug": string;
  };
  "/auth/logout": {};
  "/blog": {};
  "/healthcheck": {};
  "/shows/:slug": {
    "slug": string;
  };
  "/songs/:slug": {
    "slug": string;
  };
  "/auth/login": {};
  "/blog/:slug": {
    "slug": string;
  };
  "/tour-dates": {};
};