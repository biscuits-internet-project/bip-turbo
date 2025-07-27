import { Search } from "lucide-react";
import { useGlobalSearch } from "~/hooks/use-global-search";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SearchButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showShortcut?: boolean;
}

export function SearchButton({ 
  variant = "outline", 
  size = "default", 
  className,
  showShortcut = true 
}: SearchButtonProps) {
  const { open } = useGlobalSearch();

  const handleClick = () => {
    open();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        "justify-start text-muted-foreground",
        size === "default" && "h-9 px-3",
        className
      )}
    >
      <Search className="h-4 w-4 mr-2 pointer-events-none" />
      <span className="flex-1 text-left pointer-events-none">Search...</span>
      {showShortcut && size !== "icon" && (
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto pointer-events-none">
          <span className="text-xs pointer-events-none">⌘</span>K
        </kbd>
      )}
    </Button>
  );
}