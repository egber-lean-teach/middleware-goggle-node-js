import { logger } from "../models";
import { TokenCounts } from "../types";
import { safeExtract } from "./safeExtract";

/**
 * Extract token counts from Google AI SDK response.
 */
export function extractGoogleAITokenCounts(response: any): TokenCounts {
  try {
    const usageMetadata = response.usageMetadata;
    if (!usageMetadata) {
      return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    }

    const inputTokens = safeExtract.number(usageMetadata, "promptTokenCount");
    const outputTokens = safeExtract.number(
      usageMetadata,
      "candidatesTokenCount"
    );
    const totalTokens = safeExtract.number(usageMetadata, "totalTokenCount");

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      cachedTokens: 0,
      reasoningTokens: 0,
    };
  } catch (error) {
    logger.warning("Failed to extract Google AI token counts:", error);
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  }
}
