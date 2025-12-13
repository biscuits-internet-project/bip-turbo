import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { Form, useLoaderData, redirect } from "react-router";
import { getServerClient } from "~/server/supabase";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Authorize Application
        </h1>

        <div className="mb-6">
          <p className="text-gray-300 text-center mb-4">
            <strong className="text-white">{client?.name || "An application"}</strong> wants to access your account
          </p>
          <p className="text-gray-400 text-sm text-center">
            Signed in as {user.email}
          </p>
        </div>

        {scopes && scopes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">
              This will allow the app to:
            </h2>
            <ul className="space-y-2">
              {scopes.map((scope: string) => (
                <li key={scope} className="flex items-center text-gray-300">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {scopeDescription(scope)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Form method="post" className="space-y-3">
          <input type="hidden" name="authorization_id" value={authorizationId} />

          <button
            type="submit"
            name="decision"
            value="approve"
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Authorize
          </button>

          <button
            type="submit"
            name="decision"
            value="deny"
            className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold rounded-lg transition-colors"
          >
            Deny
          </button>
        </Form>
      </div>
    </div>
  );
}

function scopeDescription(scope: string): string {
  const descriptions: Record<string, string> = {
    openid: "Verify your identity",
    email: "View your email address",
    profile: "View your profile information",
    offline_access: "Access your data when you're not using the app",
  };
  return descriptions[scope] || scope;
}
