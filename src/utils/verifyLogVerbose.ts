import { logger } from "../models";

export function verifyLogVerbose(verboseStartup: boolean, message: string) {
  if (verboseStartup) {
    logger.debug(message);
  }
}
