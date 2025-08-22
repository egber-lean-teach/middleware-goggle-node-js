import { logger } from "../models";
import {
  OperationType,
  Provider,
  UsageMetadata,
  StreamTracker,
} from "../types";
import {
  generateTransactionId,
  formatTimestamp,
  calculateDurationMs,
  extractStopReason,
  extractModelName,
  extractUsageMetadata,
  createMeteringRequest,
  sendMeteringData,
} from "../utils";
import { ConfigurationError, StreamTrackingError } from "../models";
import { extractVertexAITokenCounts } from "../utils/extractVertexAITokenCounts";

// Configuration
const REVENIUM_API_KEY = process.env.REVENIUM_METERING_API_KEY;
const REVENIUM_BASE_URL =
  process.env.REVENIUM_METERING_BASE_URL || "https://api.revenium.io/meter/v2";

// Stream tracking storage
const streamTrackers = new Map<string, StreamTracker>();

/**
 * Initialize Vertex AI SDK middleware.
 */
function initializeVertexAIMiddleware(): void {
  if (!REVENIUM_API_KEY) {
    logger.warning(
      "REVENIUM_METERING_API_KEY not found - metering will be disabled"
    );
    return;
  }

  try {
    // Get the VertexAI class
    const { VertexAI } = require("@google-cloud/aiplatform");

    if (!VertexAI) {
      throw new Error("VertexAI class not found");
    }

    // Store original methods
    const originalGetGenerativeModel = VertexAI.prototype.getGenerativeModel;
    const originalGetEmbeddingModel = VertexAI.prototype.getEmbeddingModel;

    // Override getGenerativeModel method
    VertexAI.prototype.getGenerativeModel = function (options: any) {
      const model = originalGetGenerativeModel.call(this, options);

      // Store original methods
      const originalGenerateContent = model.generateContent;
      const originalGenerateContentStream = model.generateContentStream;

      // Override generateContent method
      model.generateContent = async function (request: any) {
        const startTime = new Date();
        const transactionId = generateTransactionId();
        const usageMetadata = extractUsageMetadata(request, this);

        logger.debug("Vertex AI generateContent called", {
          transactionId,
          model: options.model,
        });

        try {
          const result = await originalGenerateContent.call(this, request);

          // Extract token counts and other data
          const tokenCounts = extractVertexAITokenCounts(result);
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

          logger.debug("Vertex AI generateContent metering completed", {
            transactionId,
          });
          return result;
        } catch (error) {
          logger.error("Vertex AI generateContent failed", {
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

        logger.debug("Vertex AI generateContentStream called", {
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
          logger.error("Vertex AI generateContentStream failed", {
            transactionId,
            error,
          });
          throw error;
        }
      };

      return model;
    };

    // Override getEmbeddingModel method
    VertexAI.prototype.getEmbeddingModel = function (options: any) {
      const model = originalGetEmbeddingModel.call(this, options);

      // Store original method
      const originalEmbedContent = model.embedContent;

      // Override embedContent method
      model.embedContent = async function (request: any) {
        const startTime = new Date();
        const transactionId = generateTransactionId();
        const usageMetadata = extractUsageMetadata(request, this);

        logger.debug("Vertex AI embedContent called", {
          transactionId,
          model: options.model,
        });

        try {
          const result = await originalEmbedContent.call(this, request);

          // Extract token counts from Vertex AI response
          const tokenCounts = extractVertexAITokenCounts(result);
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
              OperationType.EMBED,
              false,
              0,
              usageMetadata
            ),
            REVENIUM_API_KEY,
            REVENIUM_BASE_URL
          );

          logger.debug("Vertex AI embedContent metering completed", {
            transactionId,
          });
          return result;
        } catch (error) {
          logger.error("Vertex AI embedContent failed", {
            transactionId,
            error,
          });
          throw error;
        }
      };

      return model;
    };

    logger.info("Vertex AI SDK middleware activated successfully");
  } catch (error) {
    logger.error("Failed to activate Vertex AI SDK middleware:", error);
    throw new ConfigurationError(
      "Failed to activate Vertex AI SDK middleware",
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

    // For streaming, we estimate token counts (Vertex AI SDK doesn't provide them during streaming)
    const estimatedTokenCounts = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };

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

    logger.debug("Vertex AI stream completion metering completed", {
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

// Auto-initialize middleware when module is imported
initializeVertexAIMiddleware();
