import {
  MeteringRequest,
  OperationType,
  TokenCounts,
  UsageMetadata,
} from "../types";

/**
 * Create metering request payload with new API structure.
 * Subscriber block fields are now at the top level, not nested under usageMetadata.
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
    // Core token and cost information
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
    
    // Timing information
    requestTime,
    responseTime,
    completionStartTime: responseTime,
    requestDuration,
    
    // Operation details
    stopReason,
    transactionId,
    operationType: operationType.toString(),
    isStreamed,
    timeToFirstToken,
    
    // Subscriber block fields (now at top level)
    traceId: usageMetadata?.traceId,
    taskType: usageMetadata?.taskType,
    subscriberEmail: usageMetadata?.subscriberEmail,
    subscriberId: usageMetadata?.subscriberId,
    subscriberCredentialName: usageMetadata?.subscriberCredentialName,
    subscriberCredential: usageMetadata?.subscriberCredential,
    organizationId: usageMetadata?.organizationId,
    subscriptionId: usageMetadata?.subscriptionId,
    productId: usageMetadata?.productId,
    agent: usageMetadata?.agent,
    responseQualityScore: usageMetadata?.responseQualityScore,
    
    // Middleware identification
    middlewareSource: "node",
    
    // Legacy usageMetadata (kept for backward compatibility)
    usageMetadata,
  };
}
