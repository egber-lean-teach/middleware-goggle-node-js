import { UsageMetadata } from "./usageMetadata";

export interface MeteringRequest {
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
  requestTime: string;
  responseTime: string;
  completionStartTime: string;
  requestDuration: number;
  stopReason: string;
  transactionId: string;
  operationType: string;
  isStreamed: boolean;
  timeToFirstToken: number;
  usageMetadata?: UsageMetadata;
}

export interface MeteringResponse {
  /** Response from Revenium metering API. */
  success: boolean;
  message?: string;
  data?: any;
}
