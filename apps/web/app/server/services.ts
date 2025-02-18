import { getContainer, getServices } from "@bip/core";
import { db } from "./db";
import { logger } from "./logger";

const container = getContainer(db);
const services = getServices(container, logger);

export { services };
