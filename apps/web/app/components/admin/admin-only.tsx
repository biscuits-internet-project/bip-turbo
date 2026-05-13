import { useSession } from "~/hooks/use-session";

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { user } = useSession();

  // app_metadata.isAdmin is server-controlled and surfaced into the
  // SessionUser projection; trust it as the only admin signal here.
  if (user?.isAdmin) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
