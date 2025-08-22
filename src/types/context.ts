import { ModelInfo } from "./modelInfo";
import { Provider } from "./provider";
import { TokenCounts } from "./tokenCounts";
import { UsageMetadata } from "./usageMetadata";

export interface RequestContext {
  /** Context information for API requests. */
  transactionId: string;
  startTime: Date;
  model: ModelInfo;
  usageMetadata?: UsageMetadata;
  isStreaming: boolean;
}

export interface ResponseContext {
  /** Context information for API responses. */
  endTime: Date;
  duration: number;
  tokenCounts: TokenCounts;
  stopReason: string;
  isStreaming: boolean;
  firstTokenTime?: Date;
}

export interface MiddlewareContext {
  /** Complete context for middleware operations. */
  request: RequestContext;
  response: ResponseContext;
  provider: Provider;
}
