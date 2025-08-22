import { UsageMetadata } from "./usageMetadata";

export interface StreamTracker {
  transactionId: string;
  startTime: Date;
  firstTokenTime?: Date;
  isComplete: boolean;
  usageMetadata?: UsageMetadata;
}
