import type { Venue } from "@bip/domain";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type VenueFormProps = {
  venue: Venue;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function VenueForm({ venue, onSubmit }: VenueFormProps) {
  return (
    <Card className="relative border-none bg-zinc-900/90 backdrop-blur-2xl before:pointer-events-none before:absolute before:-inset-1 before:rounded-[inherit] before:border before:border-purple-500/20 before:opacity-0 before:transition before:duration-300 hover:before:opacity-100">
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
      <div className="absolute inset-0 rounded-[inherit] shadow-2xl shadow-purple-500/5" />
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-b from-purple-500/5 to-purple-500/0 opacity-50" />
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight text-white">Venue Details</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-zinc-200">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={venue.name}
                required
                className="border-zinc-800 bg-black/50 text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium text-zinc-200">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                type="text"
                defaultValue={venue.slug}
                required
                className="border-zinc-800 bg-black/50 text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-zinc-200">
                City
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                defaultValue={venue.city ?? ""}
                className="border-zinc-800 bg-black/50 text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-zinc-200">
                State
              </Label>
              <Input
                id="state"
                name="state"
                type="text"
                defaultValue={venue.state ?? ""}
                className="border-zinc-800 bg-black/50 text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium text-zinc-200">
                Country
              </Label>
              <Input
                id="country"
                name="country"
                type="text"
                defaultValue={venue.country ?? ""}
                className="border-zinc-800 bg-black/50 text-zinc-200 placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" className="w-full bg-purple-500 text-white hover:bg-purple-600">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
