import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { COUNTRIES, US_STATES, CANADIAN_PROVINCES } from "@bip/core/venues/venue-constants";

// Create a schema for venue form (omitting auto-generated fields)
export const venueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required").refine((city) => !city.includes(","), {
    message: "City name should not contain commas",
  }),
  state: z.string().nullable(),
  country: z.string().min(1, "Country is required"),
}).refine((data) => {
  // Custom validation: if country is US or Canada, state is required
  if (data.country === "United States" || data.country === "Canada") {
    return data.state && data.state.trim() !== "";
  }
  return true;
}, {
  message: "State/Province is required for United States and Canada",
  path: ["state"],
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: defaultValues || {
      name: "",
      city: "",
      state: null,
      country: "United States",
    },
  });

  // Reset form with new defaultValues when they change (for editing existing venues)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  // Watch the country field to determine which state options to show
  const selectedCountry = form.watch("country");

  // Mark initial load as complete after form has been reset with defaultValues
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Clear state field when country changes to prevent invalid combinations
  // But skip this on initial load to preserve existing venue state
  const [previousCountry, setPreviousCountry] = useState(selectedCountry);

  useEffect(() => {
    if (!isInitialLoad && previousCountry !== selectedCountry) {
      form.setValue("state", null);
    }
    setPreviousCountry(selectedCountry);
  }, [selectedCountry, form, isInitialLoad, previousCountry]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<VenueFormValues, "name"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-primary">
                Venue Name <span className="text-error">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter venue name"
                  {...field}
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
                />
              </FormControl>
              <FormMessage className="text-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }: { field: ControllerRenderProps<VenueFormValues, "city"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-primary">
                City <span className="text-error">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter city"
                  {...field}
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
                />
              </FormControl>
              <FormMessage className="text-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }: { field: ControllerRenderProps<VenueFormValues, "state"> }) => {
            const isUSOrCanada = selectedCountry === "United States" || selectedCountry === "Canada";
            const stateOptions = selectedCountry === "United States" ? US_STATES :
                               selectedCountry === "Canada" ? CANADIAN_PROVINCES : [];

            return (
              <FormItem>
                <FormLabel className="text-content-text-primary">
                  {selectedCountry === "United States" ? "State" :
                   selectedCountry === "Canada" ? "Province" : "State/Province"}
                  {isUSOrCanada && <span className="text-error">*</span>}
                </FormLabel>
                <FormControl>
                  {isUSOrCanada ? (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value && stateOptions.includes(field.value) ? field.value : ""}
                      key={selectedCountry}
                    >
                      <SelectTrigger className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary">
                        <SelectValue placeholder={`Select ${selectedCountry === "United States" ? "state" : "province"}`} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto bg-dropdown border border-border">
                        {stateOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-dropdown hover:bg-dropdown-hover">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="Enter state or province (optional)"
                      {...field}
                      value={field.value || ""}
                      className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
                    />
                  )}
                </FormControl>
                <FormMessage className="text-error" />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }: { field: ControllerRenderProps<VenueFormValues, "country"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-primary">
                Country <span className="text-error">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[200px] overflow-y-auto bg-dropdown border border-border">
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country} className="text-dropdown hover:bg-dropdown-hover">
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-error" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-2">
          <Button type="submit" className="bg-brand-primary hover:bg-hover-accent text-content-text-primary">
            {submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(cancelHref)}
            className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
