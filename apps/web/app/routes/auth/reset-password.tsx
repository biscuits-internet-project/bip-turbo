import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { ResetPasswordForm } from "~/components/reset-password-form";
import type { RootData } from "~/root";
import { getServerClient } from "~/server/supabase";

/** Mirrors the Supabase dashboard minimum; the server is authoritative. */
const MIN_PASSWORD_LENGTH = 6;

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = getServerClient(request);

  // Check if user has a valid session for password reset
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // For password recovery, user should be authenticated after callback
  // If not authenticated, likely a session issue or expired recovery link
  if (!user) {
    throw new Response(null, {
      status: 302,
      headers: {
        ...headers,
        Location: "/auth/forgot-password?error=expired_link",
      },
    });
  }

  return {};
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const rootData = useRouteLoaderData("root") as RootData;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = rootData.env;
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return; // Prevent double submission

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation. The authority is the Supabase dashboard setting
    // (Authentication → Sign In / Providers → Email → Minimum password length); this is a
    // courtesy check so the user gets told before a round trip. If the two drift, the
    // server still rejects correctly and its message is surfaced verbatim below.
    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.trim() !== password) {
      toast.error("Password cannot start or end with spaces");
      return;
    }

    setIsLoading(true);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Provide more specific error messages based on the error type
      if (errorMessage.includes("New password should be different")) {
        toast.error("Your new password must be different from your current password.");
      } else if (errorMessage.includes("Password should be at least")) {
        // Surface Supabase's own text rather than a hardcoded number: the minimum is a
        // dashboard setting, and a baked-in "6" starts lying the moment someone raises it.
        toast.error(errorMessage);
      } else if (
        errorMessage.includes("weak") ||
        errorMessage.includes("easy to guess") ||
        errorMessage.includes("pwned")
      ) {
        // Leaked-password rejection (HaveIBeenPwned). Without this branch it fell through
        // to the generic handler, which tells the user to request a new reset link — the
        // one action that cannot help, so they retry the same password and loop.
        toast.error("That password appears in a known data breach. Please choose a different one.");
      } else if (errorMessage.includes("Auth session missing")) {
        toast.error("Your session has expired. Please request a new password reset link.");
        navigate("/auth/forgot-password");
        return;
      } else if (errorMessage.includes("Invalid session")) {
        toast.error("Invalid reset session. Please request a new password reset link.");
        navigate("/auth/forgot-password");
        return;
      } else {
        toast.error("Failed to update password. Please try again or request a new reset link.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} />
      </div>
    </div>
  );
}
