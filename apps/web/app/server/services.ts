import { getContainer, getServices } from "@bip/core";
import { getRedisClient } from "@bip/core";
import { db } from "./db";
import { logger } from "./logger";

const redis = await getRedisClient();
const container = getContainer({ db, redis, logger });
const services = getServices(container, logger);

export { services };
