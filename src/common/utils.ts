/**
 * Common utilities for Google AI middleware.
 * 
 * This module contains shared functionality used by both Google AI SDK
 * and Vertex AI SDK middleware implementations.
 */

import { v4 as uuidv4 } from 'uuid';
import { Logger } from './logger';
import { 
  UsageData, 
  OperationType, 
  ProviderMetadata, 
  TokenCounts,
  MeteringRequest,
  UsageMetadata,
  Provider
} from './types';
import { MeteringError, APIResponseError } from './exceptions';

const logger = new Logger();

/**
 * Generate a unique transaction ID.
 */
export function generateTransactionId(): string {
  return uuidv4();
}

/**
 * Format datetime as ISO string for API calls.
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

/**
 * Calculate duration in milliseconds between two timestamps.
 */
export function calculateDurationMs(startTime: Date, endTime: Date): number {
  return Math.round((endTime.getTime() - startTime.getTime()));
}

/**
 * Create provider metadata for Google AI SDK.
 */
export function createGoogleAIMetadata(): ProviderMetadata {
  return {
    provider: "Google",
    modelSource: "GOOGLE",
    sdkType: Provider.GOOGLE_AI_SDK
  };
}

/**
 * Create provider metadata for Vertex AI SDK.
 */
export function createVertexAIMetadata(): ProviderMetadata {
  return {
    provider: "Google",
    modelSource: "GOOGLE",
    sdkType: Provider.VERTEX_AI_SDK
  };
}

/**
 * Extract token counts from Google AI SDK response.
 */
export function extractGoogleAITokenCounts(response: any): TokenCounts {
  try {
    const usageMetadata = response.usageMetadata;
    if (!usageMetadata) {
      return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    }

    const inputTokens = safeExtract.number(usageMetadata, 'promptTokenCount');
    const outputTokens = safeExtract.number(usageMetadata, 'candidatesTokenCount');
    const totalTokens = safeExtract.number(usageMetadata, 'totalTokenCount');

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      cachedTokens: 0,
      reasoningTokens: 0
    };
  } catch (error) {
    logger.warning('Failed to extract Google AI token counts:', error);
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  }
}

/**
 * Extract token counts from Vertex AI SDK response.
 */
export function extractVertexAITokenCounts(response: any): TokenCounts {
  try {
    const usageMetadata = response.usageMetadata;
    if (!usageMetadata) {
      return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    }

    const inputTokens = safeExtract.number(usageMetadata, 'promptTokenCount');
    const outputTokens = safeExtract.number(usageMetadata, 'candidatesTokenCount');
    const totalTokens = safeExtract.number(usageMetadata, 'totalTokenCount');
    const cachedTokens = safeExtract.number(usageMetadata, 'cachedTokenCount');
    const reasoningTokens = safeExtract.number(usageMetadata, 'reasoningTokenCount');

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      cachedTokens,
      reasoningTokens
    };
  } catch (error) {
    logger.warning('Failed to extract Vertex AI token counts:', error);
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  }
}

/**
 * Extract stop reason from response.
 */
export function extractStopReason(response: any): string {
  try {
    // Try to extract from different possible locations
    const stopReason = 
      safeExtract.string(response, 'candidates.0.finishReason') ||
      safeExtract.string(response, 'finishReason') ||
      safeExtract.string(response, 'stopReason') ||
      'STOP';
    
    return stopReason || 'STOP';
  } catch (error) {
    logger.warning('Failed to extract stop reason:', error);
    return 'STOP';
  }
}

/**
 * Extract model name from response or request.
 */
export function extractModelName(response: any, fallbackModel?: string): string {
  try {
    const modelName = 
      safeExtract.string(response, 'model') ||
      safeExtract.string(response, 'modelName') ||
      fallbackModel ||
      'unknown-model';
    
    return modelName;
  } catch (error) {
    logger.warning('Failed to extract model name:', error);
    return fallbackModel || 'unknown-model';
  }
}

/**
 * Extract usage metadata from request or model instance.
 */
export function extractUsageMetadata(request: any, modelInstance?: any): UsageMetadata | undefined {
  try {
    // First try to get from request
    if (request.usageMetadata) {
      return request.usageMetadata;
    }

    // Then try to get from model instance
    if (modelInstance && (modelInstance as any)._reveniumUsageMetadata) {
      return (modelInstance as any)._reveniumUsageMetadata;
    }

    return undefined;
  } catch (error) {
    logger.warning('Failed to extract usage metadata:', error);
    return undefined;
  }
}

/**
 * Create metering request payload.
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
    requestTime,
    responseTime,
    completionStartTime: responseTime,
    requestDuration,
    stopReason,
    transactionId,
    operationType: operationType.toString(),
    isStreamed,
    timeToFirstToken,
    usageMetadata
  };
}

/**
 * Send metering data to Revenium.
 */
export async function sendMeteringData(
  meteringRequest: MeteringRequest,
  apiKey: string,
  baseUrl: string = 'https://api.revenium.io/meter/v2'
): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'revenium-middleware-google-nodejs/0.1.0'
      },
      body: JSON.stringify(meteringRequest)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new APIResponseError(
        `Metering API request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    logger.debug('Metering data sent successfully to Revenium');
  } catch (error) {
    if (error instanceof MeteringError) {
      throw error;
    }
    
    logger.error('Failed to send metering data to Revenium:', error);
    throw new MeteringError('Failed to send metering data to Revenium', error as Error);
  }
}

/**
 * Safe extraction utility functions.
 */
export namespace safeExtract {
  /**
   * Safely extract a value from an object, returning undefined if the path doesn't exist.
   */
  export function get<T>(obj: any, path: string, defaultValue?: T): T | undefined {
    try {
      const keys = path.split('.');
      let result = obj;
      
      for (const key of keys) {
        if (result == null || typeof result !== 'object') {
          return defaultValue;
        }
        result = result[key];
      }
      
      return result !== undefined ? result : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Safely extract a string value, returning empty string if not found.
   */
  export function string(obj: any, path: string): string {
    return get(obj, path, '') || '';
  }

  /**
   * Safely extract a number value, returning 0 if not found.
   */
  export function number(obj: any, path: string): number {
    const value = get(obj, path, 0);
    return typeof value === 'number' ? value : 0;
  }

  /**
   * Safely extract a boolean value, returning false if not found.
   */
  export function boolean(obj: any, path: string): boolean {
    return get(obj, path, false) || false;
  }

  /**
   * Safely extract an object value, returning empty object if not found.
   */
  export function object(obj: any, path: string): Record<string, any> {
    const value = get(obj, path, {});
    return typeof value === 'object' && value !== null ? value : {};
  }

  /**
   * Safely extract an array value, returning empty array if not found.
   */
  export function array(obj: any, path: string): any[] {
    const value = get(obj, path, []);
    return Array.isArray(value) ? value : [];
  }
}
