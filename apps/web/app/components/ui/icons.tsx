import { Loader2, type LucideProps, Upload, X } from "lucide-react";

export const Icons = {
  upload: Upload,
  x: X,
  spinner: Loader2,
} satisfies Record<string, React.ComponentType<LucideProps>>;
