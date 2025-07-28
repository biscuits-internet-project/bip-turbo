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
    <Card className="relative border-none bg-[hsl(var(--content-bg))]/90 backdrop-blur-2xl before:pointer-events-none before:absolute before:-inset-1 before:rounded-[inherit] before:border before:border-[hsl(var(--brand-primary))]/20 before:opacity-0 before:transition before:duration-300 hover:before:opacity-100">
      <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-[hsl(var(--brand-primary))]/10 via-transparent to-transparent" />
      <div className="absolute inset-0 rounded-[inherit] shadow-2xl shadow-[hsl(var(--brand-primary))]/5" />
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-b from-[hsl(var(--brand-primary))]/5 to-[hsl(var(--brand-primary))]/0 opacity-50" />
      <CardHeader className="space-y-1">
        <CardTitle className="text-3xl font-bold tracking-tight text-content-text-primary">Venue Details</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-content-text-secondary">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={venue.name}
                required
                className="border-content-bg-secondary bg-black/50 text-content-text-secondary placeholder:text-content-text-tertiary focus:border-focus-ring focus:ring-focus-ring/20"
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
                className="border-content-bg-secondary bg-black/50 text-content-text-secondary placeholder:text-content-text-tertiary focus:border-focus-ring focus:ring-focus-ring/20"
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
                className="border-content-bg-secondary bg-black/50 text-content-text-secondary placeholder:text-content-text-tertiary focus:border-focus-ring focus:ring-focus-ring/20"
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
                className="border-content-bg-secondary bg-black/50 text-content-text-secondary placeholder:text-content-text-tertiary focus:border-focus-ring focus:ring-focus-ring/20"
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
                className="border-content-bg-secondary bg-black/50 text-content-text-secondary placeholder:text-content-text-tertiary focus:border-focus-ring focus:ring-focus-ring/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" className="w-full bg-brand-primary text-content-text-primary hover:bg-hover-accent">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
