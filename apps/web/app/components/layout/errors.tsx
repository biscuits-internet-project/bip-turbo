import { AlertTriangle, Ghost } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";
import { Button } from "../ui/button";

export function ServerError() {
  const error = useRouteError();
  const errorMessage = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <AlertTriangle className="h-24 w-24 text-muted-foreground/50" />

      <h1 className="mt-8 text-4xl font-bold tracking-tight">500</h1>
      <h2 className="mt-4 text-2xl font-semibold">Whoa, Reality Check!</h2>
      <div className="text-center">
        <p className="mt-6 text-muted-foreground">
          Our server's on a cosmic voyage to another dimension.
          <br />
          We're sending good vibes to guide it back to Earth.
        </p>
        <p className="mt-4 text-sm text-muted-foreground font-mono">{errorMessage}</p>
      </div>
      <Button asChild className="mt-8">
        <Link to="/">Back to the Party</Link>
      </Button>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <Ghost className="h-24 w-24 text-muted-foreground/50" />

      <h1 className="mt-8 text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Whoops! This page seems to have jammed out.</p>

      <div className="mt-8 flex items-center gap-4">
        <Button asChild variant="outline">
          <Link to="/">Return Home</Link>
        </Button>
        <Button asChild>
          <Link to="/shows">Browse Shows</Link>
        </Button>
      </div>

      <p className="mt-8 max-w-md text-sm text-muted-foreground">
        If you think this is a mistake, please{" "}
        <Link to="/community" className="text-primary underline-offset-4 hover:underline">
          let us know
        </Link>
        .
      </p>
    </div>
  );
}
