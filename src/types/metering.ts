import { UsageMetadata } from "./usageMetadata";

export interface MeteringRequest {
  // Core token and cost information
  cacheCreationTokenCount: number;
  cacheReadTokenCount: number;
  inputTokenCost: number | null;
  outputTokenCost: number | null;
  totalCost: number | null;
  outputTokenCount: number;
  costType: string;
  model: string;
  inputTokenCount: number;
  provider: string;
  modelSource: string;
  reasoningTokenCount: number;
  
  // Timing information
  requestTime: string;
  responseTime: string;
  completionStartTime: string;
  requestDuration: number;
  
  // Operation details
  stopReason: string;
  transactionId: string;
  operationType: string;
  isStreamed: boolean;
  timeToFirstToken: number;
  
  // Subscriber block fields (now at top level)
  traceId?: string;
  taskType?: string;
  subscriberEmail?: string;
  subscriberId?: string;
  subscriberCredentialName?: string;
  subscriberCredential?: string;
  organizationId?: string;
  subscriptionId?: string;
  productId?: string;
  agent?: string;
  responseQualityScore?: number;
  
  // Middleware identification
  middlewareSource: string;
  
  // Legacy usageMetadata (kept for backward compatibility)
  usageMetadata?: UsageMetadata;
}

export interface MeteringResponse {
  /** Response from Revenium metering API. */
  success: boolean;
  message?: string;
  data?: any;
}
