import { dbClient, getContainer, getServices } from "@bip/core";
import { env } from "./env";
import { logger } from "./logger";

const container = getContainer({ db: dbClient, env, logger });
const services = getServices(container);

export { services };
