import { logger } from "../models";
import { verifyLogVerbose } from "./verifyLogVerbose";

export function activeMiddleware(
  verboseStartup: boolean,
  activeSDKs: string[],
  client: "google-ai" | "vertex-ai"
) {
  try {
    verifyLogVerbose(
      verboseStartup,
      client === "google-ai"
        ? "Attempting to import @google/generative-ai"
        : "Attempting to import @google-cloud/aiplatform"
    );
    const sdk: string =
      client === "google-ai"
        ? "@google/generative-ai"
        : "@google-cloud/aiplatform";
    require(sdk);
    verifyLogVerbose(
      verboseStartup,
      client === "google-ai"
        ? "@google/generative-ai imported successfully, importing middleware"
        : "@google-cloud/aiplatform imported successfully, importing middleware"
    );
    require(`../${client}/middleware`);
    logger.info(`${client} SDK middleware activated`);
    activeSDKs.push(client);
  } catch (error: unknown) {
    logger.debug(`${client} SDK not available:`, error);
  }
}
