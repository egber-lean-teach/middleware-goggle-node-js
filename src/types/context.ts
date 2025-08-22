import { ModelInfo } from "./modelInfo";
import { Provider } from "./provider";
import { TokenCounts } from "./tokenCounts";
import { UsageMetadata } from "./usageMetadata";

export interface RequestContext {
  transactionId: string;
  startTime: Date;
  model: ModelInfo;
  usageMetadata?: UsageMetadata;
  isStreaming: boolean;
}

export interface ResponseContext {
  endTime: Date;
  duration: number;
  tokenCounts: TokenCounts;
  stopReason: string;
  isStreaming: boolean;
  firstTokenTime?: Date;
}

export interface MiddlewareContext {
  request: RequestContext;
  response: ResponseContext;
  provider: Provider;
}
