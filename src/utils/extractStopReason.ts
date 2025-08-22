import { logger } from "../models";
import { safeExtract } from "./safeExtract";

/**
 * Extract stop reason from response.
 */
export function extractStopReason(response: any): string {
  try {
    // Try to extract from different possible locations
    const stopReason =
      safeExtract.string(response, "candidates.0.finishReason") ||
      safeExtract.string(response, "finishReason") ||
      safeExtract.string(response, "stopReason") ||
      "STOP";

    return stopReason || "STOP";
  } catch (error) {
    logger.warning("Failed to extract stop reason:", error);
    return "STOP";
  }
}
