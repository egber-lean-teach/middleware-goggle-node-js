/**
 * Shared type definitions for Google AI middleware.
 * 
 * This module contains common data structures and enums used across both
 * Google AI SDK and Vertex AI SDK middleware implementations.
 */

export enum OperationType {
  /** Operation types for AI API calls. */
  CHAT = 'CHAT',
  EMBED = 'EMBED'
}

export enum Provider {
  /** Supported Google AI providers. */
  GOOGLE_AI_SDK = 'google_ai_sdk',
  VERTEX_AI_SDK = 'vertex_ai_sdk'
}

export interface ProviderMetadata {
  /** Provider-specific metadata for usage records. */
  provider: string; // Always "Google" for unified reporting
  modelSource: string; // Always "GOOGLE" 
  sdkType: Provider; // Which SDK is being used
}

export interface UsageData {
  /** Standardized usage data structure for both SDKs. */
  // Core token counts (required)
  inputTokenCount: number;
  outputTokenCount: number;
  totalTokenCount: number;

  // Operation details (required)
  operationType: string; // OperationType value
  stopReason: string;
  transactionId: string;
  model: string;

  // Provider information (required)
  provider: string; // Always "Google"
  modelSource: string; // Always "GOOGLE"
  sdkType: Provider; // Which SDK was used

  // Timing information (required)
  requestTime: string;
  responseTime: string;
  completionStartTime: string;
  requestDuration: number; // milliseconds

  // Streaming and timing (optional with defaults)
  isStreamed?: boolean;
  timeToFirstToken?: number;

  // Advanced token counts (optional with defaults)
  cacheCreationTokenCount?: number;
  cacheReadTokenCount?: number;
  reasoningTokenCount?: number;

  // Cost information (optional with defaults)
  costType?: string;
  inputTokenCost?: number | null;
  outputTokenCost?: number | null;
  totalCost?: number | null;
}

export interface TokenCounts {
  /** Token count information for AI operations. */
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedTokens?: number;
  reasoningTokens?: number;
}

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

export interface ReveniumConfig {
  /** Configuration for Revenium metering service. */
  apiKey: string;
  baseUrl?: string;
  logLevel?: string;
  timeout?: number;
}

export interface GoogleAIConfig {
  /** Configuration for Google AI SDK. */
  apiKey: string;
}

export interface VertexAIConfig {
  /** Configuration for Vertex AI SDK. */
  project: string;
  location?: string;
  credentials?: string;
}

export interface MeteringRequest {
  /** Request payload for Revenium metering API. */
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

export interface StreamTracker {
  /** Tracks streaming operations for metering. */
  transactionId: string;
  startTime: Date;
  firstTokenTime?: Date;
  isComplete: boolean;
  usageMetadata?: UsageMetadata;
}

export interface ModelInfo {
  /** Information about the AI model being used. */
  name: string;
  provider: string;
  modelSource: string;
  sdkType: Provider;
}

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
