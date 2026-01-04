import { createBrowserClient } from "@supabase/ssr";
import type { LoaderFunctionArgs } from "react-router-dom";
import { useNavigate, useRouteLoaderData, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ForgotPasswordForm } from "~/components/forgot-password-form";
import type { RootData } from "~/root";
import { getServerClient } from "~/server/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = getServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to home if user is already logged in
  if (user) {
    throw new Response(null, { status: 302, headers: { Location: "/" } });
  }

  return;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const rootData = useRouteLoaderData("root") as RootData;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = rootData.env;
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Show error message if redirected back with an error
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "expired_link") {
      toast.error("Your password reset link has expired. Please request a new one.");
    }
  }, [searchParams]);

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return; // Prevent double submission

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    setIsLoading(true);
    const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        throw error;
      }

      toast.success("Check your email for the password reset link");
      navigate("/auth/login");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Provide more specific error messages based on the error type
      if (errorMessage.includes("Email not confirmed")) {
        toast.error("Please check your email and confirm your account first before resetting your password.");
      } else if (errorMessage.includes("Invalid email")) {
        toast.error("Please enter a valid email address.");
      } else if (errorMessage.includes("Email rate limit exceeded")) {
        toast.error("Too many requests. Please wait a few minutes before requesting another reset email.");
      } else if (errorMessage.includes("User not found")) {
        // For security, we don't want to reveal if an email exists or not
        // So we show the same success message as if it worked
        toast.success("Check your email for the password reset link");
        navigate("/auth/login");
        return;
      } else {
        toast.error("Failed to send reset password email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} />
      </div>
    </div>
  );
}
