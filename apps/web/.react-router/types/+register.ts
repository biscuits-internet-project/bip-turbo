import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/venues": {};
  "/shows": {};
  "/songs": {};
  "/venues/:slug": {
    "slug": string;
  };
  "/healthcheck": {};
  "/shows/:slug": {
    "slug": string;
  };
  "/songs/:slug": {
    "slug": string;
  };
  "/tour-dates": {};
  "/blog": {};
};