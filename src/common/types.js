"use strict";
/**
 * Shared type definitions for Google AI middleware.
 *
 * This module contains common data structures and enums used across both
 * Google AI SDK and Vertex AI SDK middleware implementations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = exports.OperationType = void 0;
var OperationType;
(function (OperationType) {
    /** Operation types for AI API calls. */
    OperationType["CHAT"] = "CHAT";
    OperationType["EMBED"] = "EMBED";
})(OperationType || (exports.OperationType = OperationType = {}));
var Provider;
(function (Provider) {
    /** Supported Google AI providers. */
    Provider["GOOGLE_AI_SDK"] = "google_ai_sdk";
    Provider["VERTEX_AI_SDK"] = "vertex_ai_sdk";
})(Provider || (exports.Provider = Provider = {}));
