import { UsageMetadata } from "./usageMetadata";

export interface StreamTracker {
  /** Tracks streaming operations for metering. */
  transactionId: string;
  startTime: Date;
  firstTokenTime?: Date;
  isComplete: boolean;
  usageMetadata?: UsageMetadata;
}
