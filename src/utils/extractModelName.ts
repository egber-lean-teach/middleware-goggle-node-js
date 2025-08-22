import { logger } from "../models";
import { safeExtract } from "./safeExtract";

/**
 * Extract model name from response or request.
 */
export function extractModelName(
  response: any,
  fallbackModel?: string
): string {
  try {
    const modelName =
      safeExtract.string(response, "model") ||
      safeExtract.string(response, "modelName") ||
      fallbackModel ||
      "unknown-model";

    return modelName;
  } catch (error) {
    logger.warning("Failed to extract model name:", error);
    return fallbackModel || "unknown-model";
  }
}
