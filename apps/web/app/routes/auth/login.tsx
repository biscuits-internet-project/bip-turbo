import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { redirect, useNavigate, useRouteLoaderData } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { LoginForm } from "~/components/login-form";
import type { RootData } from "~/root";
import { getServerClient } from "~/server/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, headers } = getServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return redirect("/", { headers });

  return;
};

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const rootData = useRouteLoaderData("root") as RootData;
  const { SUPABASE_URL, SUPABASE_ANON_KEY, BASE_URL } = rootData.env;

  const doGoogleAuth = async () => {
    const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${BASE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google auth error:", error);
      setError("An unexpected error occurred");
    }

    if (data) {
      console.log("Google auth data:", data);
    }
  };

  const doEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login form submitted");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Attempting login with:", { email });

    try {
      const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        return;
      }

      console.log("Login successful:", data);
      navigate("/");
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={doEmailLogin} onGoogleClick={doGoogleAuth} />
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
