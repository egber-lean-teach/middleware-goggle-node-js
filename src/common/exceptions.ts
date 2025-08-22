/**
 * Common exceptions for Google AI middleware.
 * 
 * This module contains exception classes used across both Google AI SDK
 * and Vertex AI SDK middleware implementations.
 */

export class MeteringError extends Error {
  /** Base exception for metering-related errors. */
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'MeteringError';
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MeteringError);
    }
  }
}

export class APIResponseError extends MeteringError {
  /** Exception for API response errors. */
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly responseData?: any,
    cause?: Error
  ) {
    super(message, cause);
    this.name = 'APIResponseError';
  }
}

export class ConfigurationError extends MeteringError {
  /** Exception for configuration errors. */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'ConfigurationError';
  }
}

export class TokenCountingError extends MeteringError {
  /** Exception for token counting errors. */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'TokenCountingError';
  }
}

export class MiddlewareActivationError extends MeteringError {
  /** Exception for middleware activation errors. */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'MiddlewareActivationError';
  }
}

export class StreamTrackingError extends MeteringError {
  /** Exception for stream tracking errors. */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'StreamTrackingError';
  }
}

/**
 * Safe extraction utility functions for error handling.
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
