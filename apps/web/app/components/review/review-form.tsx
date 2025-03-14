import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

const reviewFormSchema = z.object({
  content: z.string().min(1, "Review content is required"),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  onSubmit: (data: ReviewFormValues) => Promise<void>;
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      content: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }: { field: ControllerRenderProps<ReviewFormValues, "content"> }) => (
            <FormItem>
              <FormLabel className="text-gray-200 text-lg">Write a Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts about this show..."
                  {...field}
                  className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white">
          Post Review
        </Button>
      </form>
    </Form>
  );
}
