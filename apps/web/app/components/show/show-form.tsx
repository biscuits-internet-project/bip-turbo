import type { Band, RockOpera } from "@bip/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShowYoutubeManager } from "~/components/show/show-youtube-manager";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { GlassSelect } from "~/components/ui/glass-select";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { VenueSearch } from "~/components/venue/venue-search";
import { formInputClass } from "~/lib/form-styles";
import { cn } from "~/lib/utils";

const showFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  venueId: z.string(),
  bandId: z.string(),
  notes: z.string(),
  relistenUrl: z.string(),
  countForStats: z.boolean(),
  rockOperaIds: z.array(z.string().uuid()),
});

export type ShowFormValues = z.infer<typeof showFormSchema>;

interface ShowFormProps {
  defaultValues?: ShowFormValues;
  onSubmit: (data: ShowFormValues) => void;
  submitLabel?: string;
  cancelHref?: string;
  bands?: Band[];
  showId?: string;
  /**
   * Full list of rock operas to render as a checkbox group. Empty array
   * hides the group entirely (e.g. on a fresh-install local DB with no
   * rock operas seeded yet).
   */
  rockOperas?: RockOpera[];
}

export function ShowForm({
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
  cancelHref,
  showId,
  rockOperas = [],
}: ShowFormProps) {
  const form = useForm<ShowFormValues>({
    resolver: zodResolver(showFormSchema),
    defaultValues: defaultValues || {
      date: "",
      venueId: "none",
      bandId: "db7f2c5d-2727-41fd-bd6f-e91c74164f09",
      notes: "",
      relistenUrl: "",
      countForStats: true,
      rockOperaIds: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className={formInputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venueId"
          render={({ field }: { field: ControllerRenderProps<ShowFormValues, "venueId"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Venue</FormLabel>
              <FormControl>
                <VenueSearch
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Search for a venue..."
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bandId"
          render={({ field }: { field: ControllerRenderProps<ShowFormValues, "bandId"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Band</FormLabel>
              <FormControl>
                <GlassSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a band"
                  className="w-full"
                  options={[
                    { value: "none", label: "No band" },
                    { value: "db7f2c5d-2727-41fd-bd6f-e91c74164f09", label: "The Disco Biscuits" },
                  ]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {rockOperas.length > 0 && (
          <FormField
            control={form.control}
            name="rockOperaIds"
            render={({ field }: { field: ControllerRenderProps<ShowFormValues, "rockOperaIds"> }) => {
              const value = field.value ?? [];
              return (
                <FormItem>
                  <div className="text-sm font-medium text-content-text-secondary">Full rock opera performances</div>
                  <p className="text-xs text-content-text-tertiary">
                    Tag this show as a full performance of one or more rock operas.
                  </p>
                  <div className="flex flex-col gap-2 pt-1">
                    {rockOperas.map((opera) => {
                      const checked = value.includes(opera.id);
                      const checkboxId = `rock-opera-${opera.id}`;
                      return (
                        <div key={opera.id} className="flex items-center gap-2">
                          <Checkbox
                            id={checkboxId}
                            checked={checked}
                            onCheckedChange={(next) => {
                              if (next) {
                                field.onChange([...value, opera.id]);
                              } else {
                                field.onChange(value.filter((id) => id !== opera.id));
                              }
                            }}
                          />
                          <label htmlFor={checkboxId} className="text-sm text-content-text-primary cursor-pointer">
                            {opera.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }: { field: ControllerRenderProps<ShowFormValues, "notes"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter show notes" {...field} className={cn(formInputClass, "min-h-[100px]")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showId && <ShowYoutubeManager showId={showId} />}

        <FormField
          control={form.control}
          name="countForStats"
          render={({ field }: { field: ControllerRenderProps<ShowFormValues, "countForStats"> }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Count for stats" />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className="text-content-text-secondary">Count for stats</FormLabel>
                <p className="text-xs text-content-text-tertiary">
                  Off for soundchecks, radio sessions, cancelled stubs.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button type="submit" variant="brand">
            {submitLabel}
          </Button>
          {cancelHref && (
            <Button type="button" variant="cancel" asChild>
              <a href={cancelHref}>Cancel</a>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
