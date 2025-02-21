import { getContainer, getServices } from "@bip/core";
import { db } from "./db";
import { env } from "./env";
import { logger } from "./logger";

const container = getContainer({ db, env, logger });
const services = getServices(container);

export { services };
