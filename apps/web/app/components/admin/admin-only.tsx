import { useSupabaseContext } from "~/context/supabase-provider";
import { useSession } from "~/hooks/use-session";

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { user, loading: isLoading } = useSession();

  // If Supabase context is not loaded yet, render nothing
  if (isLoading) {
    return null;
  }

  //if (user?.user_metadata?.role === "admin") {
  if (user) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
