export interface TokenCounts {
  /** Token count information for AI operations. */
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedTokens?: number;
  reasoningTokens?: number;
}
