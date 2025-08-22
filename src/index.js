"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeSDKList = exports.version = void 0;
var dotenv_1 = require("dotenv");
var logger_1 = require("./common/logger");
// Load environment variables
(0, dotenv_1.config)();
// Set up logging
var logger = new logger_1.Logger();
// Check if verbose startup logging is enabled
var verboseStartup = ((_a = process.env.REVENIUM_VERBOSE_STARTUP) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true';
if (verboseStartup) {
    logger.info('Revenium middleware initialization starting');
}
// Import and activate middleware for available SDKs
var activeSDKs = [];
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
}
catch (error) {
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
}
catch (error) {
    logger.debug('Vertex AI SDK (@google-cloud/aiplatform) not available:', error);
}
// Import common utilities (always available)
__exportStar(require("./common/utils"), exports);
__exportStar(require("./common/types"), exports);
__exportStar(require("./common/exceptions"), exports);
logger.info('Revenium middleware activated for: %s', activeSDKs.length > 0 ? activeSDKs.join(', ') : 'none');
exports.version = '0.1.0';
exports.activeSDKList = activeSDKs;
