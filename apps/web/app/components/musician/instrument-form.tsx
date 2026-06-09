import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate, useSubmit } from "react-router-dom";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { formInputClass } from "~/lib/form-styles";

export const instrumentFormSchema = z.object({
  name: z.string().min(1, "Instrument name is required"),
});

export type InstrumentFormValues = z.infer<typeof instrumentFormSchema>;

interface InstrumentFormProps {
  defaultValues?: InstrumentFormValues;
  submitLabel: string;
  cancelHref: string;
}

export function InstrumentForm({ defaultValues, submitLabel, cancelHref }: InstrumentFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();

  const form = useForm<InstrumentFormValues>({
    resolver: zodResolver(instrumentFormSchema),
    defaultValues: defaultValues || {
      name: "",
    },
  });

  const onSubmit = (data: InstrumentFormValues) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value.toString());
    }
    submit(formData, { method: "post" });
  };

  return (
    <Form {...form}>
      <div className="space-y-6 max-w-2xl" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<InstrumentFormValues, "name"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Instrument Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter instrument name" {...field} className={formInputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {submitLabel}
          </Button>
          <Button type="button" variant="cancel" onClick={() => navigate(cancelHref)}>
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
}
