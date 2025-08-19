import { dbClient, getContainer, getServices } from "@bip/core";
import { env } from "./env";
import { logger } from "./logger";

const r2Config = {
  accountId: env.R2_ACCOUNT_ID,
  accessKeyId: env.R2_ACCESS_KEY_ID,
  secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  bucketName: env.R2_BUCKET_NAME,
  publicUrl: env.R2_PUBLIC_URL,
};

const container = getContainer({ db: dbClient, env, r2Config, logger });
const services = getServices(container);

export { services };
