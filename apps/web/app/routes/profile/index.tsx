import { redirect } from "react-router";
import { protectedLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

/** A stable link to your own profile, for pages that don't know your username. */
export const loader = protectedLoader(async ({ context }) => {
  const user = await services.users.findByEmail(context.currentUser.email);
  if (!user) throw new Response("User not found", { status: 404 });
  return redirect(`/users/${encodeURIComponent(user.username)}`);
});
