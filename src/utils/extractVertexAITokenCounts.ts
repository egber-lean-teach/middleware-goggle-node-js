import { logger } from "../models";
import { TokenCounts } from "../types";
import { safeExtract } from "./safeExtract";

/**
 * Extract token counts from Vertex AI SDK response.
 */
export function extractVertexAITokenCounts(response: any): TokenCounts {
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
    const cachedTokens = safeExtract.number(usageMetadata, "cachedTokenCount");
    const reasoningTokens = safeExtract.number(
      usageMetadata,
      "reasoningTokenCount"
    );

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      cachedTokens,
      reasoningTokens,
    };
  } catch (error) {
    logger.warning("Failed to extract Vertex AI token counts:", error);
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  }
}
