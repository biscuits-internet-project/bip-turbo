import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import type { Band } from "@bip/domain";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { VenueSearch } from "~/components/venue/venue-search";

const showFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  venueId: z.string(),
  bandId: z.string(),
  notes: z.string(),
  relistenUrl: z.string(),
});

export type ShowFormValues = z.infer<typeof showFormSchema>;

interface ShowFormProps {
  defaultValues?: ShowFormValues;
  onSubmit: (data: ShowFormValues) => void;
  submitLabel?: string;
  cancelHref?: string;
  bands?: Band[];
}

export function ShowForm({ defaultValues, onSubmit, submitLabel = "Submit", cancelHref, bands = [] }: ShowFormProps) {
  const form = useForm<ShowFormValues>({
    resolver: zodResolver(showFormSchema),
    defaultValues: defaultValues || {
      date: "",
      venueId: "none",
      bandId: "db7f2c5d-2727-41fd-bd6f-e91c74164f09",
      notes: "",
      relistenUrl: "",
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
                <Input type="date" {...field} className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary" />
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary">
                    <SelectValue placeholder="Select a band" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-content-bg-secondary border-content-bg-secondary">
                  <SelectItem value="none">No band</SelectItem>
                  <SelectItem value="db7f2c5d-2727-41fd-bd6f-e91c74164f09" className="text-content-text-primary hover:bg-content-bg-secondary">
                    The Disco Biscuits
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }: { field: ControllerRenderProps<ShowFormValues, "notes"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter show notes"
                  {...field}
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relistenUrl"
          render={({ field }: { field: ControllerRenderProps<ShowFormValues, "relistenUrl"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Relisten URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Relisten URL"
                  {...field}
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button type="submit" className="bg-brand-primary hover:bg-hover-accent text-content-text-primary">
            {submitLabel}
          </Button>
          {cancelHref && (
            <Button
              type="button"
              variant="outline"
              asChild
              className="border-content-bg-secondary text-content-text-secondary hover:bg-content-bg-secondary hover:text-content-text-primary"
            >
              <a href={cancelHref}>Cancel</a>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
