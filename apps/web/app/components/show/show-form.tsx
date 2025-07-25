import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const showFormSchema = z.object({
  date: z.string(),
});

export type ShowFormValues = z.infer<typeof showFormSchema>;

interface ShowFormProps {
  defaultValues?: ShowFormValues;
  onSubmit: (data: ShowFormValues) => void;
  submitLabel?: string;
  cancelHref?: string;
}

export function ShowForm({ defaultValues, onSubmit, submitLabel = "Submit", cancelHref }: ShowFormProps) {
  const form = useForm<ShowFormValues>({
    resolver: zodResolver(showFormSchema),
    defaultValues: defaultValues || {
      date: "",
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
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {cancelHref && (
            <Button variant="outline" type="button" asChild>
              <a href={cancelHref}>Cancel</a>
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
}
