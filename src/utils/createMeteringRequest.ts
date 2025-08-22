import {
  MeteringRequest,
  OperationType,
  TokenCounts,
  UsageMetadata,
} from "../types";

/**
 * Create metering request payload.
 */
export function createMeteringRequest(
  transactionId: string,
  model: string,
  tokenCounts: TokenCounts,
  stopReason: string,
  requestTime: string,
  responseTime: string,
  requestDuration: number,
  operationType: OperationType,
  isStreamed: boolean,
  timeToFirstToken: number,
  usageMetadata?: UsageMetadata
): MeteringRequest {
  return {
    cacheCreationTokenCount: tokenCounts.cachedTokens || 0,
    cacheReadTokenCount: 0,
    inputTokenCost: null, // Let backend calculate from model pricing
    outputTokenCost: null, // Let backend calculate from model pricing
    totalCost: null, // Let backend calculate from model pricing
    outputTokenCount: tokenCounts.outputTokens,
    costType: "AI",
    model,
    inputTokenCount: tokenCounts.inputTokens,
    provider: "Google",
    modelSource: "GOOGLE",
    reasoningTokenCount: tokenCounts.reasoningTokens || 0,
    requestTime,
    responseTime,
    completionStartTime: responseTime,
    requestDuration,
    stopReason,
    transactionId,
    operationType: operationType.toString(),
    isStreamed,
    timeToFirstToken,
    usageMetadata,
  };
}
