import { Cake, PartyPopper, Sparkle, Trophy } from "lucide-react";
import { getAnniversaryYears, getOrdinalSuffix } from "~/lib/utils";

type AnniversaryTier = "minor" | "medium" | "major" | "legendary";

function getTier(years: number): AnniversaryTier {
  if (years >= 25) return "legendary";
  if (years === 20) return "major";
  if (years === 10 || years === 15) return "medium";
  return "minor";
}

const anniversaryIcons: Record<AnniversaryTier, typeof Sparkle> = {
  minor: Sparkle,
  medium: PartyPopper,
  major: Cake,
  legendary: Trophy,
};

interface AnniversaryBadgeProps {
  showDate: string;
}

export function AnniversaryBadge({ showDate }: AnniversaryBadgeProps) {
  const years = getAnniversaryYears(showDate);
  if (!years) return null;
  const tier = getTier(years);
  const Icon = anniversaryIcons[tier];
  return (
    <span className="flex items-center gap-1 text-sm font-medium text-amber-400">
      <Icon className="h-4 w-4" />
      {years}
      {getOrdinalSuffix(years)} Anniversary
    </span>
  );
}
