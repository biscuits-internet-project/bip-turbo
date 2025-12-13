import { adminAction, publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const REDIS_KEY = "support:donations-received";

export const loader = publicLoader(async () => {
  const amount = await services.redis.get<number>(REDIS_KEY);
  return Response.json({ donationsReceived: amount ?? 0 });
});

export const action = adminAction(async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await request.json();
  const amount = Number(body.amount);

  if (Number.isNaN(amount) || amount < 0) {
    return Response.json({ error: "Invalid amount" }, { status: 400 });
  }

  await services.redis.set(REDIS_KEY, amount);
  return Response.json({ success: true, donationsReceived: amount });
});
