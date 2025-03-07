import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

// Create a schema for venue form (omitting auto-generated fields)
export const venueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
});

export type VenueFormValues = z.infer<typeof venueFormSchema>;

interface VenueFormProps {
  defaultValues?: VenueFormValues;
  onSubmit: (data: VenueFormValues) => Promise<void>;
  submitLabel: string;
  cancelHref: string;
}

export function VenueForm({ defaultValues, onSubmit, submitLabel, cancelHref }: VenueFormProps) {
  const navigate = useNavigate();

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: defaultValues || {
      name: "",
      city: null,
      state: null,
      country: null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<VenueFormValues, "name"> }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Venue Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter venue name" {...field} className="bg-gray-800 border-gray-700 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }: { field: ControllerRenderProps<VenueFormValues, "city"> }) => (
            <FormItem>
              <FormLabel className="text-gray-200">City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter city"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }: { field: ControllerRenderProps<VenueFormValues, "state"> }) => (
            <FormItem>
              <FormLabel className="text-gray-200">State</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter state"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }: { field: ControllerRenderProps<VenueFormValues, "country"> }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter country"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelHref)}
            className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
