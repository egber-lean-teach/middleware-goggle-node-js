/**
 * Revenium middleware for Google AI services.
 * 
 * This package provides middleware to track and meter usage of Google AI services
 * including Google AI SDK (@google/generative-ai) and Vertex AI SDK (@google-cloud/aiplatform).
 * 
 * The middleware automatically wraps API calls to capture usage metrics and send
 * them to Revenium for tracking and billing purposes.
 * 
 * Usage:
 *     Simply import this package before using Google AI services:
 *     
 *     import 'revenium-middleware-google-nodejs';
 *     import { GoogleGenerativeAI } from '@google/generative-ai'; // or import VertexAI
 *     
 *     // Your existing code works unchanged
 *     const genAI = new GoogleGenerativeAI(apiKey);
 *     const result = await genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" }).generateContent("Hello");
 */

import { config } from 'dotenv';
import { Logger } from './common/logger';

// Load environment variables
config();

// Set up logging
const logger = new Logger();

// Check if verbose startup logging is enabled
const verboseStartup = process.env.REVENIUM_VERBOSE_STARTUP?.toLowerCase() === 'true';

if (verboseStartup) {
  logger.info('Revenium middleware initialization starting');
}

// Import and activate middleware for available SDKs
let activeSDKs: string[] = [];

try {
  // Try to import Google AI SDK and activate middleware
  if (verboseStartup) {
    logger.debug('Attempting to import @google/generative-ai');
  }
  
  // Dynamic import to check availability
  require('@google/generative-ai');
  
  if (verboseStartup) {
    logger.debug('@google/generative-ai imported successfully, importing middleware');
  }
  
  // Import and activate Google AI middleware
  require('./google-ai/middleware');
  logger.info('Google AI SDK middleware activated');
  activeSDKs.push('google_ai');
} catch (error) {
  logger.debug('Google AI SDK (@google/generative-ai) not available:', error);
}

try {
  // Try to import Vertex AI SDK and activate middleware
  if (verboseStartup) {
    logger.debug('Attempting to import @google-cloud/aiplatform');
  }
  
  // Dynamic import to check availability
  require('@google-cloud/aiplatform');
  
  if (verboseStartup) {
    logger.debug('@google-cloud/aiplatform imported successfully, importing middleware');
  }
  
  // Import and activate Vertex AI middleware
  require('./vertex-ai/middleware');
  logger.info('Vertex AI SDK middleware activated');
  activeSDKs.push('vertex_ai');
} catch (error) {
  logger.debug('Vertex AI SDK (@google-cloud/aiplatform) not available:', error);
}

// Import common utilities (always available)
export * from './common/utils';
export * from './common/types';
export * from './common/exceptions';

logger.info('Revenium middleware activated for: %s',
  activeSDKs.length > 0 ? activeSDKs.join(', ') : 'none');

export const version = '0.1.0';
export const activeSDKList = activeSDKs;
