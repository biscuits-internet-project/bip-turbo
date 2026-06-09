import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useNavigate, useSubmit } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

interface EntityFormProps<TValues extends FieldValues> {
  form: UseFormReturn<TValues>;
  submitLabel: string;
  cancelHref: string;
  /** The field rows (FormField elements) for this entity. */
  children: ReactNode;
}

/**
 * Shared chrome for the admin entity forms (authors, instruments, musicians):
 * the react-hook-form provider, the submit/cancel button row, and a generic
 * FormData post where null/undefined fields collapse to "" so the route action
 * can clear them. Callers build the typed form and supply the field rows.
 */
export function EntityForm<TValues extends FieldValues>({
  form,
  submitLabel,
  cancelHref,
  children,
}: EntityFormProps<TValues>) {
  const navigate = useNavigate();
  const submit = useSubmit();

  const onSubmit = (data: TValues) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value == null ? "" : String(value));
    }
    submit(formData, { method: "post" });
  };

  return (
    <Form {...form}>
      <div className="space-y-6 max-w-2xl" onSubmit={form.handleSubmit(onSubmit)}>
        {children}
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
