import { logger } from "../models";
import {
  OperationType,
  Provider,
  UsageMetadata,
  StreamTracker,
} from "../types";
import {
  formatTimestamp,
  calculateDurationMs,
  extractGoogleAITokenCounts,
  extractStopReason,
  extractModelName,
  extractUsageMetadata,
  createMeteringRequest,
  sendMeteringData,
} from "../utils";
import { ConfigurationError, StreamTrackingError } from "../models";
import { generateTransactionId } from "../utils";

// Configuration
const REVENIUM_API_KEY = process.env.REVENIUM_METERING_API_KEY;
const REVENIUM_BASE_URL =
  process.env.REVENIUM_METERING_BASE_URL || "https://api.revenium.io/meter/v2";

// Stream tracking storage
const streamTrackers = new Map<string, StreamTracker>();

// Track if middleware has been initialized to avoid double initialization
let middlewareInitialized = false;

/**
 * Initialize Google AI SDK middleware.
 */
function initializeGoogleAIMiddleware(): void {
  if (middlewareInitialized) {
    console.log("🔍 [DEBUG] Middleware already initialized, skipping...");
    return;
  }

  if (!REVENIUM_API_KEY) {
    logger.warning(
      "REVENIUM_METERING_API_KEY not found - metering will be disabled"
    );
    return;
  }

  try {
    // Get the GoogleGenerativeAI class - try different import strategies
    let GoogleGenerativeAI;

    try {
      // First try require (for CommonJS/dynamic imports)
      GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
    } catch (error) {
      // If require fails, the module might be imported as ES module
      console.log("🔍 [DEBUG] require failed, trying module.exports...");
      const moduleExports = require("@google/generative-ai");
      GoogleGenerativeAI =
        moduleExports.GoogleGenerativeAI ||
        moduleExports.default?.GoogleGenerativeAI;
    }

    if (!GoogleGenerativeAI) {
      throw new Error("GoogleGenerativeAI class not found");
    }

    console.log(
      "🔍 [DEBUG] GoogleGenerativeAI class found, setting up middleware..."
    );

    // Store original methods
    const originalGetGenerativeModel =
      GoogleGenerativeAI.prototype.getGenerativeModel;
    const originalGetEmbeddingModel =
      GoogleGenerativeAI.prototype.getEmbeddingModel;

    console.log(
      "🔍 [DEBUG] Original methods stored, overriding getGenerativeModel..."
    );

    // Mark as initialized
    middlewareInitialized = true;

    // Override getGenerativeModel method
    GoogleGenerativeAI.prototype.getGenerativeModel = function (options: any) {
      console.log(
        "🔍 [DEBUG] getGenerativeModel called with options:",
        options
      );
      const model = originalGetGenerativeModel.call(this, options);

      // Store original methods
      const originalGenerateContent = model.generateContent;
      const originalGenerateContentStream = model.generateContentStream;

      console.log("🔍 [DEBUG] Overriding generateContent method...");

      // Override generateContent method
      model.generateContent = async function (request: any) {
        console.log("🔍 [DEBUG] generateContent intercepted by middleware!");
        const startTime = new Date();
        const transactionId = generateTransactionId();
        const usageMetadata = extractUsageMetadata(request, this);

        logger.debug("Google AI generateContent called", {
          transactionId,
          model: options.model,
        });

        try {
          const result = await originalGenerateContent.call(this, request);

          // Extract token counts and other data
          const tokenCounts = extractGoogleAITokenCounts(result);
          const stopReason = extractStopReason(result);
          const modelName = extractModelName(result, options.model);
          const endTime = new Date();
          const duration = calculateDurationMs(startTime, endTime);

          // Send metering data
          await sendMeteringData(
            createMeteringRequest(
              transactionId,
              modelName,
              tokenCounts,
              stopReason,
              formatTimestamp(startTime),
              formatTimestamp(endTime),
              duration,
              OperationType.CHAT,
              false,
              0,
              usageMetadata
            ),
            REVENIUM_API_KEY,
            REVENIUM_BASE_URL
          );

          logger.debug("Google AI generateContent metering completed", {
            transactionId,
          });
          return result;
        } catch (error) {
          logger.error("Google AI generateContent failed", {
            transactionId,
            error,
          });
          throw error;
        }
      };

      // Override generateContentStream method
      model.generateContentStream = async function (request: any) {
        const startTime = new Date();
        const transactionId = generateTransactionId();
        const usageMetadata = extractUsageMetadata(request, this);
        let firstTokenTime: Date | undefined;

        logger.debug("Google AI generateContentStream called", {
          transactionId,
          model: options.model,
        });

        // Create stream tracker
        const streamTracker: StreamTracker = {
          transactionId,
          startTime,
          firstTokenTime,
          isComplete: false,
          usageMetadata,
        };
        streamTrackers.set(transactionId, streamTracker);

        try {
          const result = await originalGenerateContentStream.call(
            this,
            request
          );

          // Override the stream to track first token and completion
          const originalStream = result.stream;
          const wrappedStream = {
            [Symbol.asyncIterator]: async function* () {
              let isFirstToken = true;

              try {
                for await (const chunk of originalStream) {
                  if (isFirstToken) {
                    firstTokenTime = new Date();
                    streamTracker.firstTokenTime = firstTokenTime;
                    isFirstToken = false;
                  }
                  yield chunk;
                }
              } finally {
                // Stream completed, send metering data
                await handleStreamCompletion(
                  transactionId,
                  startTime,
                  firstTokenTime,
                  options.model,
                  usageMetadata
                );
              }
            },
          };

          // Replace the stream property
          Object.defineProperty(result, "stream", {
            value: wrappedStream,
            writable: false,
            configurable: false,
          });

          return result;
        } catch (error) {
          // Clean up stream tracker on error
          streamTrackers.delete(transactionId);
          logger.error("Google AI generateContentStream failed", {
            transactionId,
            error,
          });
          throw error;
        }
      };

      return model;
    };

    // Override getEmbeddingModel method
    GoogleGenerativeAI.prototype.getEmbeddingModel = function (options: any) {
      const model = originalGetEmbeddingModel.call(this, options);

      // Store original method
      const originalEmbedContent = model.embedContent;

      // Override embedContent method
      model.embedContent = async function (request: any) {
        const startTime = new Date();
        const transactionId = generateTransactionId();
        const usageMetadata = extractUsageMetadata(request, this);

        logger.debug("Google AI embedContent called", {
          transactionId,
          model: options.model,
        });

        try {
          const result = await originalEmbedContent.call(this, request);

          // For embeddings, we can't get token counts from Google AI SDK
          const tokenCounts = {
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
          };
          const stopReason = "STOP";
          const modelName = extractModelName(result, options.model);
          const endTime = new Date();
          const duration = calculateDurationMs(startTime, endTime);

          // Send metering data
          await sendMeteringData(
            createMeteringRequest(
              transactionId,
              modelName,
              tokenCounts,
              stopReason,
              formatTimestamp(startTime),
              formatTimestamp(endTime),
              duration,
              OperationType.EMBED,
              false,
              0,
              usageMetadata
            ),
            REVENIUM_API_KEY,
            REVENIUM_BASE_URL
          );

          logger.debug("Google AI embedContent metering completed", {
            transactionId,
          });
          return result;
        } catch (error) {
          logger.error("Google AI embedContent failed", {
            transactionId,
            error,
          });
          throw error;
        }
      };

      return model;
    };

    logger.info("Google AI SDK middleware activated successfully");
  } catch (error) {
    logger.error("Failed to activate Google AI SDK middleware:", error);
    throw new ConfigurationError(
      "Failed to activate Google AI SDK middleware",
      error as Error
    );
  }
}

/**
 * Handle stream completion and send metering data.
 */
async function handleStreamCompletion(
  transactionId: string,
  startTime: Date,
  firstTokenTime: Date | undefined,
  modelName: string,
  usageMetadata?: UsageMetadata
): Promise<void> {
  try {
    const streamTracker = streamTrackers.get(transactionId);
    if (!streamTracker) {
      logger.warning("Stream tracker not found for transaction", {
        transactionId,
      });
      return;
    }

    const endTime = new Date();
    const duration = calculateDurationMs(startTime, endTime);
    const timeToFirstToken = firstTokenTime
      ? calculateDurationMs(startTime, firstTokenTime)
      : 0;

    // For streaming, we estimate token counts (Google AI SDK doesn't provide them during streaming)
    const estimatedTokenCounts = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };
    console.log("hola");

    // Send metering data
    await sendMeteringData(
      createMeteringRequest(
        transactionId,
        modelName,
        estimatedTokenCounts,
        "STOP",
        formatTimestamp(startTime),
        formatTimestamp(endTime),
        duration,
        OperationType.CHAT,
        true,
        timeToFirstToken,
        usageMetadata
      ),
      REVENIUM_API_KEY || "",
      REVENIUM_BASE_URL
    );

    // Clean up stream tracker
    streamTrackers.delete(transactionId);

    logger.debug("Google AI stream completion metering completed", {
      transactionId,
    });
  } catch (error) {
    logger.error("Failed to handle stream completion metering", {
      transactionId,
      error,
    });
    // Clean up stream tracker on error
    streamTrackers.delete(transactionId);
  }
}

// Export the function so it can be manually called
export { initializeGoogleAIMiddleware };

// Lazy initialization - intercept GoogleGenerativeAI constructor
function lazyInitializeMiddleware() {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    if (!GoogleGenerativeAI || middlewareInitialized) {
      return;
    }

    console.log(
      "🔍 [DEBUG] Lazy initializing middleware on first GoogleGenerativeAI instantiation..."
    );

    // Store original constructor
    const OriginalGoogleGenerativeAI = GoogleGenerativeAI;

    // Override constructor to trigger middleware initialization
    function InterceptedGoogleGenerativeAI(...args: any[]) {
      console.log(
        "🔍 [DEBUG] GoogleGenerativeAI constructor called, initializing middleware..."
      );

      // Initialize middleware if not already done
      if (!middlewareInitialized) {
        initializeGoogleAIMiddleware();
      }

      // Call original constructor
      return new OriginalGoogleGenerativeAI(...args);
    }

    // Copy prototype and static properties
    InterceptedGoogleGenerativeAI.prototype =
      OriginalGoogleGenerativeAI.prototype;
    Object.setPrototypeOf(
      InterceptedGoogleGenerativeAI,
      OriginalGoogleGenerativeAI
    );

    // Replace in module cache
    const moduleCache = require.cache[require.resolve("@google/generative-ai")];
    if (moduleCache) {
      moduleCache.exports.GoogleGenerativeAI = InterceptedGoogleGenerativeAI;
      moduleCache.exports = {
        ...moduleCache.exports,
        GoogleGenerativeAI: InterceptedGoogleGenerativeAI,
      };
    }

    console.log(
      "🔍 [DEBUG] GoogleGenerativeAI constructor intercepted successfully"
    );
  } catch (error) {
    console.log("🔍 [DEBUG] Could not set up lazy initialization:", error);
  }
}

// Set up lazy initialization
lazyInitializeMiddleware();

// Auto-initialize middleware when module is imported (fallback)
// initializeGoogleAIMiddleware();
