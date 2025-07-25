import { GlobalSearchDialog } from "./global-search-dialog";
import { useGlobalSearch } from "~/hooks/use-global-search";

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useGlobalSearch();

  return (
    <>
      {children}
      <GlobalSearchDialog open={isOpen} onOpenChange={close} />
    </>
  );
}