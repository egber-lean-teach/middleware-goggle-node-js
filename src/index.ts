import { config } from "dotenv";
import { logger } from "./models";
import { activeMiddleware } from "./utils/activeMiddleware";
import { verifyLogVerbose } from "./utils/verifyLogVerbose";

config();

const verboseStartup =
  process.env.REVENIUM_VERBOSE_STARTUP?.toLowerCase() === "true";

verifyLogVerbose(verboseStartup, "Revenium middleware initialization starting");

// Activate middleware for available SDKs
let activeSDKs: string[] = [];
activeMiddleware(verboseStartup, activeSDKs, "google-ai");
activeMiddleware(verboseStartup, activeSDKs, "vertex-ai");

export * from "./utils";
export * from "./types";
export * from "./models";

// Log the active SDKs
logger.info(
  "Revenium middleware activated for: %s",
  activeSDKs.length > 0 ? activeSDKs.join(", ") : "none"
);

export const version = "0.1.0";
export const activeSDKList = activeSDKs;
