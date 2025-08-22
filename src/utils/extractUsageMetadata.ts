import { logger } from "../models";
import { UsageMetadata } from "../types";

/**
 * Extract usage metadata from request or model instance.
 */
export function extractUsageMetadata(
  request: any,
  modelInstance?: any
): UsageMetadata | undefined {
  try {
    // First try to get from request
    if (request.usageMetadata) {
      return request.usageMetadata;
    }

    // Then try to get from model instance
    if (modelInstance && (modelInstance as any)._reveniumUsageMetadata) {
      return (modelInstance as any)._reveniumUsageMetadata;
    }

    return undefined;
  } catch (error) {
    logger.warning("Failed to extract usage metadata:", error);
    return undefined;
  }
}
