import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { Form, useLoaderData, redirect } from "react-router";
import { Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ServerError } from "~/components/layout/errors";
import { getServerClient } from "~/server/supabase";

export const ErrorBoundary = ServerError;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const authorizationId = url.searchParams.get("authorization_id");

  if (!authorizationId) {
    throw new Response("Missing authorization_id", { status: 400 });
  }

  const { supabase } = getServerClient(request);

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Redirect to login, then back here
    const returnUrl = encodeURIComponent(request.url);
    return redirect(`/auth/login?returnTo=${returnUrl}`);
  }

  // Get authorization details
  const { data: authDetails, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);

  if (error || !authDetails) {
    throw new Response(error?.message || "Failed to get authorization details", { status: 400 });
  }

  return {
    authorizationId,
    client: authDetails.client,
    scopes: authDetails.scope?.split(" ") || [],
    user: { email: user.email },
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const authorizationId = formData.get("authorization_id") as string;
  const decision = formData.get("decision") as string;

  if (!authorizationId) {
    throw new Response("Missing authorization_id", { status: 400 });
  }

  const { supabase } = getServerClient(request);

  if (decision === "approve") {
    const { data, error } = await supabase.auth.oauth.approveAuthorization(authorizationId);
    if (error) {
      throw new Response(error.message, { status: 400 });
    }
    // Redirect to the callback URL provided by Supabase
    return redirect(data.redirect_url);
  } else {
    const { data, error } = await supabase.auth.oauth.denyAuthorization(authorizationId);
    if (error) {
      throw new Response(error.message, { status: 400 });
    }
    return redirect(data.redirect_url);
  }
}

export default function OAuthConsent() {
  const { authorizationId, client, scopes, user } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="relative border border-brand/10 bg-content-bg/90 backdrop-blur-2xl transition-colors duration-300">
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-brand/10 via-transparent to-transparent" />
          <div className="absolute inset-0 rounded-[inherit] shadow-2xl shadow-brand/5" />
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-b from-brand/5 to-brand/0 opacity-50" />

          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-content-text-primary">
              Authorize Application
            </CardTitle>
            <CardDescription className="text-base text-content-text-secondary">
              <strong className="text-content-text-primary">{client?.name || "An application"}</strong> wants to access your account
            </CardDescription>
            <p className="text-sm text-content-text-tertiary">
              Signed in as {user.email}
            </p>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {scopes && scopes.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold text-content-text-tertiary uppercase tracking-wide mb-3">
                  This will allow the app to:
                </h2>
                <ul className="space-y-2">
                  {scopes.map((scope: string) => (
                    <li key={scope} className="flex items-center text-content-text-secondary">
                      <Check className="w-4 h-4 mr-2 text-brand-secondary" />
                      {scopeDescription(scope)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Form method="post" className="space-y-3">
              <input type="hidden" name="authorization_id" value={authorizationId} />

              <Button
                type="submit"
                name="decision"
                value="approve"
                className="w-full bg-brand-secondary hover:bg-brand-secondary/90 text-white font-semibold"
              >
                Authorize
              </Button>

              <Button
                type="submit"
                name="decision"
                value="deny"
                variant="outline"
                className="w-full text-content-text-secondary border-content-bg-secondary hover:bg-content-bg-secondary/50"
              >
                Deny
              </Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function scopeDescription(scope: string): string {
  const descriptions: Record<string, string> = {
    openid: "Verify your identity",
    profile: "View your profile information",
    email: "View your email address",
  };
  return descriptions[scope] || scope;
}
