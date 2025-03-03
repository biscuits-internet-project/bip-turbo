import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { redirect, useRouteLoaderData } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "~/components/register-form";
import type { RootData } from "~/root";
import { getServerClient } from "~/server/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const supabase = getServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return redirect("/");

  return;
};

export default function Register() {
  const rootData = useRouteLoaderData("root") as RootData;
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = rootData.env;

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const doRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dataFields = Object.fromEntries(formData.entries());

    const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.auth.signUp({
      email: dataFields.email as string,
      password: dataFields.password as string,
      options: {
        data: {
          username: dataFields.username as string,
        },
      },
    });

    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }

    if (data.session) {
      // Redirect to home page on successful registration
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm onSubmit={doRegister} />
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
