import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        // The project's primary CTA — purple brand bg with the darker
        // `hover-accent` token on hover. Used for "Save", "Update",
        // "Add Track", etc. across the admin forms.
        brand: "bg-brand-primary text-content-text-primary",
        // Secondary "Cancel / back / dismiss" CTA — outlined dark-theme
        // border with a transition. Paired with `variant="brand"`
        // submits across the admin forms.
        cancel: "border bg-transparent text-content-text-secondary hover:text-content-text-primary",
        destructive: "",
        // Outlined red delete affordance — shared by the track delete row and
        // the show/entity delete buttons so every "delete" reads the same.
        destructiveOutline: "border border-red-600 bg-transparent text-red-400 hover:bg-red-900/20",
        outline: "border",
        secondary: "",
        ghost: "",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // Semantic hook for the selected variant, so tests assert the variant is
    // applied without coupling to its Tailwind classes. `asChild` forwards it
    // onto the rendered child via Slot.
    return (
      <Comp
        data-variant={variant ?? "default"}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
