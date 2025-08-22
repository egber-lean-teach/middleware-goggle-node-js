export interface UsageMetadata {
  /** Optional metadata for enhanced usage tracking. */
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
}
