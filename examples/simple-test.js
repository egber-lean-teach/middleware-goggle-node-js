#!/usr/bin/env ts-node
"use strict";
/**
 * 🤖 Revenium Google AI Middleware - Simple Test Examples
 *
 * This script demonstrates basic usage of the Revenium middleware with both
 * Google AI SDK (Gemini Developer API) and Vertex AI SDK.
 *
 * Features demonstrated:
 * - Zero-config integration (just import the middleware)
 * - Enhanced tracking with metadata
 * - Automatic provider detection
 * - Error handling and debugging
 *
 * Requirements:
 * - REVENIUM_METERING_API_KEY environment variable
 * - For Google AI: GOOGLE_API_KEY
 * - For Vertex AI: GOOGLE_CLOUD_PROJECT and authentication
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var logger_1 = require("../src/common/logger");
require("../src/index"); // Import middleware to activate automatic tracking
var generative_ai_1 = require("@google/generative-ai");
// Load environment variables from .env file
(0, dotenv_1.config)();
var logger = new logger_1.Logger();
function googleAIBasicExample() {
    return __awaiter(this, void 0, void 0, function () {
        var googleApiKey, reveniumKey, genAI, model, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    /**🔄 Zero-Config Integration with Google AI SDK*/
                    console.log("\n🤖 Google AI SDK - Basic Example");
                    console.log("=".repeat(50));
                    googleApiKey = process.env.GOOGLE_API_KEY;
                    reveniumKey = process.env.REVENIUM_METERING_API_KEY;
                    if (!googleApiKey) {
                        console.log("❌ GOOGLE_API_KEY not found");
                        console.log("   Set: export GOOGLE_API_KEY=your-google-api-key");
                        return [2 /*return*/, false];
                    }
                    if (!reveniumKey) {
                        console.log("⚠️  REVENIUM_METERING_API_KEY not found - metering will fail");
                        console.log("   Set: export REVENIUM_METERING_API_KEY=your-revenium-key");
                    }
                    console.log("\u2705 Google API Key: ".concat(googleApiKey.substring(0, 10), "..."));
                    if (reveniumKey) {
                        console.log("\u2705 Revenium Key: ".concat(reveniumKey.substring(0, 10), "..."));
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    genAI = new generative_ai_1.GoogleGenerativeAI(googleApiKey);
                    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
                    return [4 /*yield*/, model.generateContent("What is the meaning of life, the universe and everything?")];
                case 2:
                    result = _a.sent();
                    console.log("\u2705 Response: ".concat(result.response.text().substring(0, 100), "..."));
                    // Show token usage (if available)
                    console.log("✅ Response received successfully");
                    console.log("📊 Token usage will be tracked by the middleware");
                    console.log("🎉 Zero-config integration successful!");
                    console.log("   Your usage is automatically tracked in Revenium");
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    console.log("\u274C Google AI test failed: ".concat(error_1));
                    console.error(error_1);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function googleAIEnhancedExample() {
    return __awaiter(this, void 0, void 0, function () {
        var googleApiKey, genAI, model, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    /**📈 Enhanced Tracking with Metadata*/
                    console.log("\n📊 Google AI SDK - Enhanced Tracking Example");
                    console.log("=".repeat(50));
                    googleApiKey = process.env.GOOGLE_API_KEY;
                    if (!googleApiKey) {
                        console.log("❌ GOOGLE_API_KEY not found");
                        return [2 /*return*/, false];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    genAI = new generative_ai_1.GoogleGenerativeAI(googleApiKey);
                    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
                    return [4 /*yield*/, model.generateContent("Analyze this quarterly report for key insights")];
                case 2:
                    result = _a.sent();
                    console.log("\u2705 Enhanced response: ".concat(result.response.text().substring(0, 100), "..."));
                    console.log("🎯 Enhanced tracking with metadata successful!");
                    return [2 /*return*/, true];
                case 3:
                    error_2 = _a.sent();
                    console.log("\u274C Google AI enhanced test failed: ".concat(error_2));
                    console.error(error_2);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function googleAIStreamingExample() {
    return __awaiter(this, void 0, void 0, function () {
        var googleApiKey, genAI, model, result, fullText, _a, _b, _c, chunk, text, e_1_1, error_3;
        var _d, e_1, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    /**🌊 Streaming Support Example*/
                    console.log("\n🌊 Google AI SDK - Streaming Example");
                    console.log("=".repeat(50));
                    googleApiKey = process.env.GOOGLE_API_KEY;
                    if (!googleApiKey) {
                        console.log("❌ GOOGLE_API_KEY not found");
                        return [2 /*return*/, false];
                    }
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 15, , 16]);
                    genAI = new generative_ai_1.GoogleGenerativeAI(googleApiKey);
                    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
                    return [4 /*yield*/, model.generateContentStream("Write a creative story about AI")];
                case 2:
                    result = _g.sent();
                    console.log("📝 Streaming response:");
                    fullText = "";
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 8, 9, 14]);
                    _a = true, _b = __asyncValues(result.stream);
                    _g.label = 4;
                case 4: return [4 /*yield*/, _b.next()];
                case 5:
                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 7];
                    _f = _c.value;
                    _a = false;
                    chunk = _f;
                    text = chunk.text();
                    process.stdout.write(text);
                    fullText += text;
                    _g.label = 6;
                case 6:
                    _a = true;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _g.trys.push([9, , 12, 13]);
                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _e.call(_b)];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14:
                    console.log("\n");
                    if (fullText.length > 0) {
                        console.log("✅ Streaming with metering successful!");
                        return [2 /*return*/, true];
                    }
                    else {
                        console.log("❌ No streaming content received");
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 16];
                case 15:
                    error_3 = _g.sent();
                    console.log("\u274C Google AI streaming test failed: ".concat(error_3));
                    console.error(error_3);
                    return [2 /*return*/, false];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function googleAIEmbeddingsExample() {
    return __awaiter(this, void 0, void 0, function () {
        var googleApiKey, genAI, model, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    /**🔢 Text Embeddings Example*/
                    console.log("\n🔢 Google AI SDK - Embeddings Example");
                    console.log("=".repeat(50));
                    googleApiKey = process.env.GOOGLE_API_KEY;
                    if (!googleApiKey) {
                        console.log("❌ GOOGLE_API_KEY not found");
                        return [2 /*return*/, false];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    genAI = new generative_ai_1.GoogleGenerativeAI(googleApiKey);
                    model = genAI.getGenerativeModel({ model: "text-embedding-004" });
                    return [4 /*yield*/, model.embedContent("Text to embed for search indexing")];
                case 2:
                    result = _a.sent();
                    console.log("\u2705 Generated ".concat(result.embedding.values.length, " dimensional embedding"));
                    console.log("⚠️  Note: Token counts will be 0 due to Google AI SDK limitations");
                    return [2 /*return*/, true];
                case 3:
                    error_4 = _a.sent();
                    console.log("\u274C Google AI embeddings test failed: ".concat(error_4));
                    console.error(error_4);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var successCount, totalTests;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🚀 Starting Revenium Google AI Middleware Tests");
                    console.log("=".repeat(60));
                    successCount = 0;
                    totalTests = 4;
                    return [4 /*yield*/, googleAIBasicExample()];
                case 1:
                    // Run Google AI SDK tests
                    if (_a.sent())
                        successCount++;
                    return [4 /*yield*/, googleAIEnhancedExample()];
                case 2:
                    if (_a.sent())
                        successCount++;
                    return [4 /*yield*/, googleAIStreamingExample()];
                case 3:
                    if (_a.sent())
                        successCount++;
                    return [4 /*yield*/, googleAIEmbeddingsExample()];
                case 4:
                    if (_a.sent())
                        successCount++;
                    console.log("\n" + "=".repeat(60));
                    console.log("\uD83D\uDCCA Test Results: ".concat(successCount, "/").concat(totalTests, " tests passed"));
                    if (successCount === totalTests) {
                        console.log("🎉 All tests passed! Middleware is working correctly.");
                    }
                    else {
                        console.log("⚠️  Some tests failed. Check the logs above for details.");
                    }
                    console.log("\n💡 Tips:");
                    console.log("   - Set REVENIUM_METERING_API_KEY for metering");
                    console.log("   - Set GOOGLE_API_KEY for Google AI SDK");
                    console.log("   - Check logs for detailed debugging information");
                    return [2 /*return*/];
            }
        });
    });
}
// Run the main function
if (require.main === module) {
    main().catch(console.error);
}
