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
              <FormLabel className="text-gray-200">Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="bg-gray-800 border-gray-700 text-white" />
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
              <FormLabel className="text-gray-200">Venue</FormLabel>
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
              <FormLabel className="text-gray-200">Band</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a band" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="none">No band</SelectItem>
                  <SelectItem value="db7f2c5d-2727-41fd-bd6f-e91c74164f09" className="text-white hover:bg-gray-700">
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
              <FormLabel className="text-gray-200">Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter show notes"
                  {...field}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
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
              <FormLabel className="text-gray-200">Relisten URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Relisten URL"
                  {...field}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button type="submit" className="bg-purple-800 hover:bg-purple-700 text-white">
            {submitLabel}
          </Button>
          {cancelHref && (
            <Button
              type="button"
              variant="outline"
              asChild
              className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              <a href={cancelHref}>Cancel</a>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
