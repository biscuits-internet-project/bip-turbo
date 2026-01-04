import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MessageSquare, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactDialogProps {
  children: React.ReactNode;
}

export function ContactDialog({ children }: ContactDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("subject", data.subject);
      formData.append("message", data.message);

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setIsSubmitted(true);
      form.reset();
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Close dialog after success message
      closeTimeoutRef.current = setTimeout(() => {
        setOpen(false);
        setIsSubmitted(false);
      }, 3000);
    } catch (_error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass-content border-glass-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-content-text-primary text-xl">Get in Touch</DialogTitle>
          <DialogDescription className="text-content-text-secondary">
            Have a question or feedback? We'd love to hear from you.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-brand-primary" />
            <h3 className="text-lg font-semibold text-content-text-primary mb-2">Message Sent!</h3>
            <p className="text-content-text-secondary">Thanks for reaching out. We'll get back to you soon.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }: { field: ControllerRenderProps<ContactFormValues, "name"> }) => (
                  <FormItem>
                    <FormLabel className="text-content-text-primary">Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-text-secondary" />
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          className="glass-content pl-9 text-content-text-primary focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }: { field: ControllerRenderProps<ContactFormValues, "email"> }) => (
                  <FormItem>
                    <FormLabel className="text-content-text-primary">Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-text-secondary" />
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          className="glass-content pl-9 text-content-text-primary focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }: { field: ControllerRenderProps<ContactFormValues, "subject"> }) => (
                  <FormItem>
                    <FormLabel className="text-content-text-primary">Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What's this about?"
                        {...field}
                        className="glass-content text-content-text-primary focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }: { field: ControllerRenderProps<ContactFormValues, "message"> }) => (
                  <FormItem>
                    <FormLabel className="text-content-text-primary">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more..."
                        {...field}
                        className="glass-content text-content-text-primary min-h-[100px] focus:ring-1 focus:ring-brand-primary/50 focus:border-brand-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="btn-secondary">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
