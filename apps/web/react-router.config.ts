import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "./app",
  // TLS ends at kamal-proxy and react-router-serve doesn't trust X-Forwarded-Proto, so the
  // server sees http:// URLs while browsers send an https:// Origin. React Router compares
  // the scheme too, and without this rejects every form post to a page route as cross-site.
  allowedActionOrigins: ["discobiscuits.net"],
} satisfies Config;
