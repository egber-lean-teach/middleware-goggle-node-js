import { config } from "dotenv";
import { logger } from "./models";

config();

const verboseStartup =
  process.env.REVENIUM_VERBOSE_STARTUP?.toLowerCase() === "true";

if (verboseStartup) {
  logger.info("Revenium middleware initialization starting");
}

// Import and activate middleware for available SDKs
let activeSDKs: string[] = [];

try {
  // Try to import Google AI SDK and activate middleware
  if (verboseStartup) {
    logger.debug("Attempting to import @google/generative-ai");
  }

  // Dynamic import to check availability
  require("@google/generative-ai");

  if (verboseStartup) {
    logger.debug(
      "@google/generative-ai imported successfully, importing middleware"
    );
  }

  // Import and activate Google AI middleware
  require("./google-ai/middleware");
  logger.info("Google AI SDK middleware activated");
  activeSDKs.push("google_ai");
} catch (error) {
  logger.debug("Google AI SDK (@google/generative-ai) not available:", error);
}

try {
  // Try to import Vertex AI SDK and activate middleware
  if (verboseStartup) {
    logger.debug("Attempting to import @google-cloud/aiplatform");
  }

  // Dynamic import to check availability
  require("@google-cloud/aiplatform");

  if (verboseStartup) {
    logger.debug(
      "@google-cloud/aiplatform imported successfully, importing middleware"
    );
  }

  // Import and activate Vertex AI middleware
  require("./vertex-ai/middleware");
  logger.info("Vertex AI SDK middleware activated");
  activeSDKs.push("vertex_ai");
} catch (error) {
  logger.debug(
    "Vertex AI SDK (@google-cloud/aiplatform) not available:",
    error
  );
}

export * from "./utils";
export * from "./types";
export * from "./models";

logger.info(
  "Revenium middleware activated for: %s",
  activeSDKs.length > 0 ? activeSDKs.join(", ") : "none"
);

export const version = "0.1.0";
export const activeSDKList = activeSDKs;
