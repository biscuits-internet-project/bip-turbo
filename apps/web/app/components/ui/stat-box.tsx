import type { ReactNode } from "react";
import { cardVariants } from "~/components/ui/card";

interface StatBoxProps {
  label: string;
  value: ReactNode;
  /** Optional icon shown beside the label (venue pages); omitted on song/musician. */
  icon?: ReactNode;
  sublabel?: ReactNode;
  sublabel2?: ReactNode;
}

/**
 * Glass stat card used across detail pages (song, musician, venue) for
 * headline figures like play counts and first/last performance dates. On
 * phone-landscape (`short:`) viewports the padding, value font, and spacing
 * shrink so a grid of these stays above the fold.
 */
export function StatBox({ label, value, icon, sublabel, sublabel2 }: StatBoxProps) {
  return (
    <div
      className={cardVariants({
        variant: "panel",
        className: "p-2 sm:p-3 short:!py-1 short:!px-2.5 rounded-lg h-full",
      })}
    >
      <dt className="flex items-center gap-2 text-sm short:!text-[11px] short:!leading-tight font-medium text-content-text-secondary">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 short:!mt-0.5">
        <span className="text-xl sm:text-3xl short:!text-base short:!leading-tight font-bold text-content-text-primary">
          {value}
        </span>
        {sublabel && (
          <div className="mt-1 text-sm short:!text-[11px] short:!leading-tight short:!mt-0.5 text-content-text-tertiary">
            {sublabel}
          </div>
        )}
        {sublabel2 && (
          <div className="mt-3 text-sm text-content-text-tertiary hidden sm:block short:hidden">{sublabel2}</div>
        )}
      </dd>
    </div>
  );
}
