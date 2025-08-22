import { Provider } from "./provider";

export interface UsageData {
  inputTokenCount: number;
  outputTokenCount: number;
  totalTokenCount: number;
  operationType: string; // OperationType value
  stopReason: string;
  transactionId: string;
  model: string;
  provider: string; // Always "Google"
  modelSource: string; // Always "GOOGLE"
  sdkType: Provider; // Which SDK was used
  requestTime: string;
  responseTime: string;
  completionStartTime: string;
  requestDuration: number;
  isStreamed?: boolean;
  timeToFirstToken?: number;
  cacheCreationTokenCount?: number;
  cacheReadTokenCount?: number;
  reasoningTokenCount?: number;
  costType?: string;
  inputTokenCost?: number | null;
  outputTokenCost?: number | null;
  totalCost?: number | null;
}
