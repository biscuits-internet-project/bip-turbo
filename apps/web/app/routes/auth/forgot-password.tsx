import { createBrowserClient } from "@supabase/ssr";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { toast } from "sonner";
import { ForgotPasswordForm } from "~/components/forgot-password-form";
import type { ClientSideEnv } from "~/root";
import { getServerClient } from "~/server/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = getServerClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to home if user is already logged in
  if (session) {
    throw new Response(null, { status: 302, headers: { Location: "/" } });
  }

  return;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const rootData = useRouteLoaderData("root") as ClientSideEnv;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = rootData;
  const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success("Check your email for the password reset link");
      navigate("/auth/login");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send reset password email");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm onSubmit={handleResetPassword} />
      </div>
    </div>
  );
}
