import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

// The app's surface system. A card's background is picked by intent, not by
// pasting a raw CSS class:
//   elevated — the dominant content block (gradient, brand border, drop shadow).
//   panel    — flat frosted surface for things nested inside an elevated card
//              (stat tiles, chart containers, small info cards).
//   plain    — bare shadcn card (border + shadow, no background of its own);
//              the escape hatch for cards that supply their own bg (auth cards).
// `elevated` is the default so a bare <Card> is the common content block.
// Exported for the handful of div/`asChild` sites that can't be a <Card>.
const cardVariants = cva("rounded-lg", {
  variants: {
    variant: {
      // Gradient, brand border, drop shadow — all supplied by the class.
      elevated: "card-premium",
      // Flat frosted surface: its own bg/border, intentionally no shadow.
      panel: "glass-content",
      // Bare shadcn card: border + shadow, no background of its own. Callers
      // that need a fill supply their own bg-* (e.g. the auth cards).
      plain: "border shadow-sm",
    },
  },
  defaultVariants: {
    variant: "elevated",
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-sm", className)} {...props} />,
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
