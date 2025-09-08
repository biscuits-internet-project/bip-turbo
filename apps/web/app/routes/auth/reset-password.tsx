import { createBrowserClient } from "@supabase/ssr";
import type { LoaderFunctionArgs } from "react-router-dom";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { ResetPasswordForm } from "~/components/reset-password-form";
import type { RootData } from "~/root";
import { getServerClient } from "~/server/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = getServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User must be authenticated to reset password
  if (!user) {
    throw new Response(null, { status: 302, headers: { Location: "/auth/login" } });
  }

  return {};
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const rootData = useRouteLoaderData("root") as RootData;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = rootData.env;

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success("Password updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm onSubmit={handleResetPassword} />
      </div>
    </div>
  );
}
