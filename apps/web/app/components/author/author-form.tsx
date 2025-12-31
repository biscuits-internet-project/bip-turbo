import { zodResolver } from "@hookform/resolvers/zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate, useSubmit } from "react-router-dom";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export const authorFormSchema = z.object({
  name: z.string().min(1, "Author name is required"),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;

interface AuthorFormProps {
  defaultValues?: AuthorFormValues;
  submitLabel: string;
  cancelHref: string;
}

export function AuthorForm({ defaultValues, submitLabel, cancelHref }: AuthorFormProps) {
  const navigate = useNavigate();
  const submit = useSubmit();

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: defaultValues || {
      name: "",
    },
  });

  const onSubmit = (data: AuthorFormValues) => {
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
          render={({ field }: { field: ControllerRenderProps<AuthorFormValues, "name"> }) => (
            <FormItem>
              <FormLabel className="text-content-text-secondary">Author Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter author name"
                  {...field}
                  className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(cancelHref)}>
            Cancel
          </Button>
        </div>
      </div>
    </Form>
  );
}
