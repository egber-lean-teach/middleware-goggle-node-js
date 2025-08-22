"use strict";
/**
 * Common utilities for Google AI middleware.
 *
 * This module contains shared functionality used by both Google AI SDK
 * and Vertex AI SDK middleware implementations.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeExtract = void 0;
exports.generateTransactionId = generateTransactionId;
exports.formatTimestamp = formatTimestamp;
exports.calculateDurationMs = calculateDurationMs;
exports.createGoogleAIMetadata = createGoogleAIMetadata;
exports.createVertexAIMetadata = createVertexAIMetadata;
exports.extractGoogleAITokenCounts = extractGoogleAITokenCounts;
exports.extractVertexAITokenCounts = extractVertexAITokenCounts;
exports.extractStopReason = extractStopReason;
exports.extractModelName = extractModelName;
exports.extractUsageMetadata = extractUsageMetadata;
exports.createMeteringRequest = createMeteringRequest;
exports.sendMeteringData = sendMeteringData;
var uuid_1 = require("uuid");
var logger_1 = require("./logger");
var types_1 = require("./types");
var exceptions_1 = require("./exceptions");
var logger = new logger_1.Logger();
/**
 * Generate a unique transaction ID.
 */
function generateTransactionId() {
    return (0, uuid_1.v4)();
}
/**
 * Format datetime as ISO string for API calls.
 */
function formatTimestamp(date) {
    return date.toISOString();
}
/**
 * Calculate duration in milliseconds between two timestamps.
 */
function calculateDurationMs(startTime, endTime) {
    return Math.round((endTime.getTime() - startTime.getTime()));
}
/**
 * Create provider metadata for Google AI SDK.
 */
function createGoogleAIMetadata() {
    return {
        provider: "Google",
        modelSource: "GOOGLE",
        sdkType: types_1.Provider.GOOGLE_AI_SDK
    };
}
/**
 * Create provider metadata for Vertex AI SDK.
 */
function createVertexAIMetadata() {
    return {
        provider: "Google",
        modelSource: "GOOGLE",
        sdkType: types_1.Provider.VERTEX_AI_SDK
    };
}
/**
 * Extract token counts from Google AI SDK response.
 */
function extractGoogleAITokenCounts(response) {
    try {
        var usageMetadata = response.usageMetadata;
        if (!usageMetadata) {
            return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
        }
        var inputTokens = safeExtract.number(usageMetadata, 'promptTokenCount');
        var outputTokens = safeExtract.number(usageMetadata, 'candidatesTokenCount');
        var totalTokens = safeExtract.number(usageMetadata, 'totalTokenCount');
        return {
            inputTokens: inputTokens,
            outputTokens: outputTokens,
            totalTokens: totalTokens,
            cachedTokens: 0,
            reasoningTokens: 0
        };
    }
    catch (error) {
        logger.warning('Failed to extract Google AI token counts:', error);
        return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    }
}
/**
 * Extract token counts from Vertex AI SDK response.
 */
function extractVertexAITokenCounts(response) {
    try {
        var usageMetadata = response.usageMetadata;
        if (!usageMetadata) {
            return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
        }
        var inputTokens = safeExtract.number(usageMetadata, 'promptTokenCount');
        var outputTokens = safeExtract.number(usageMetadata, 'candidatesTokenCount');
        var totalTokens = safeExtract.number(usageMetadata, 'totalTokenCount');
        var cachedTokens = safeExtract.number(usageMetadata, 'cachedTokenCount');
        var reasoningTokens = safeExtract.number(usageMetadata, 'reasoningTokenCount');
        return {
            inputTokens: inputTokens,
            outputTokens: outputTokens,
            totalTokens: totalTokens,
            cachedTokens: cachedTokens,
            reasoningTokens: reasoningTokens
        };
    }
    catch (error) {
        logger.warning('Failed to extract Vertex AI token counts:', error);
        return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    }
}
/**
 * Extract stop reason from response.
 */
function extractStopReason(response) {
    try {
        // Try to extract from different possible locations
        var stopReason = safeExtract.string(response, 'candidates.0.finishReason') ||
            safeExtract.string(response, 'finishReason') ||
            safeExtract.string(response, 'stopReason') ||
            'STOP';
        return stopReason || 'STOP';
    }
    catch (error) {
        logger.warning('Failed to extract stop reason:', error);
        return 'STOP';
    }
}
/**
 * Extract model name from response or request.
 */
function extractModelName(response, fallbackModel) {
    try {
        var modelName = safeExtract.string(response, 'model') ||
            safeExtract.string(response, 'modelName') ||
            fallbackModel ||
            'unknown-model';
        return modelName;
    }
    catch (error) {
        logger.warning('Failed to extract model name:', error);
        return fallbackModel || 'unknown-model';
    }
}
/**
 * Extract usage metadata from request or model instance.
 */
function extractUsageMetadata(request, modelInstance) {
    try {
        // First try to get from request
        if (request.usageMetadata) {
            return request.usageMetadata;
        }
        // Then try to get from model instance
        if (modelInstance && modelInstance._reveniumUsageMetadata) {
            return modelInstance._reveniumUsageMetadata;
        }
        return undefined;
    }
    catch (error) {
        logger.warning('Failed to extract usage metadata:', error);
        return undefined;
    }
}
/**
 * Create metering request payload.
 */
function createMeteringRequest(transactionId, model, tokenCounts, stopReason, requestTime, responseTime, requestDuration, operationType, isStreamed, timeToFirstToken, usageMetadata) {
    return {
        cacheCreationTokenCount: tokenCounts.cachedTokens || 0,
        cacheReadTokenCount: 0,
        inputTokenCost: null, // Let backend calculate from model pricing
        outputTokenCost: null, // Let backend calculate from model pricing
        totalCost: null, // Let backend calculate from model pricing
        outputTokenCount: tokenCounts.outputTokens,
        costType: "AI",
        model: model,
        inputTokenCount: tokenCounts.inputTokens,
        provider: "Google",
        modelSource: "GOOGLE",
        reasoningTokenCount: tokenCounts.reasoningTokens || 0,
        requestTime: requestTime,
        responseTime: responseTime,
        completionStartTime: responseTime,
        requestDuration: requestDuration,
        stopReason: stopReason,
        transactionId: transactionId,
        operationType: operationType.toString(),
        isStreamed: isStreamed,
        timeToFirstToken: timeToFirstToken,
        usageMetadata: usageMetadata
    };
}
/**
 * Send metering data to Revenium.
 */
function sendMeteringData(meteringRequest_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function (meteringRequest, apiKey, baseUrl) {
        var response, errorData, error_1;
        if (baseUrl === void 0) { baseUrl = 'https://api.revenium.io/meter/v2'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch("".concat(baseUrl, "/completions"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(apiKey),
                                'User-Agent': 'revenium-middleware-google-nodejs/0.1.0'
                            },
                            body: JSON.stringify(meteringRequest)
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.text()];
                case 2:
                    errorData = _a.sent();
                    throw new exceptions_1.APIResponseError("Metering API request failed with status ".concat(response.status), response.status, errorData);
                case 3:
                    logger.debug('Metering data sent successfully to Revenium');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    if (error_1 instanceof exceptions_1.MeteringError) {
                        throw error_1;
                    }
                    logger.error('Failed to send metering data to Revenium:', error_1);
                    throw new exceptions_1.MeteringError('Failed to send metering data to Revenium', error_1);
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Safe extraction utility functions.
 */
var safeExtract;
(function (safeExtract) {
    /**
     * Safely extract a value from an object, returning undefined if the path doesn't exist.
     */
    function get(obj, path, defaultValue) {
        try {
            var keys = path.split('.');
            var result = obj;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (result == null || typeof result !== 'object') {
                    return defaultValue;
                }
                result = result[key];
            }
            return result !== undefined ? result : defaultValue;
        }
        catch (_a) {
            return defaultValue;
        }
    }
    safeExtract.get = get;
    /**
     * Safely extract a string value, returning empty string if not found.
     */
    function string(obj, path) {
        return get(obj, path, '') || '';
    }
    safeExtract.string = string;
    /**
     * Safely extract a number value, returning 0 if not found.
     */
    function number(obj, path) {
        var value = get(obj, path, 0);
        return typeof value === 'number' ? value : 0;
    }
    safeExtract.number = number;
    /**
     * Safely extract a boolean value, returning false if not found.
     */
    function boolean(obj, path) {
        return get(obj, path, false) || false;
    }
    safeExtract.boolean = boolean;
    /**
     * Safely extract an object value, returning empty object if not found.
     */
    function object(obj, path) {
        var value = get(obj, path, {});
        return typeof value === 'object' && value !== null ? value : {};
    }
    safeExtract.object = object;
    /**
     * Safely extract an array value, returning empty array if not found.
     */
    function array(obj, path) {
        var value = get(obj, path, []);
        return Array.isArray(value) ? value : [];
    }
    safeExtract.array = array;
})(safeExtract || (exports.safeExtract = safeExtract = {}));
