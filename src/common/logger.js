"use strict";
/**
 * Common logger for Google AI middleware.
 *
 * This module provides consistent logging functionality used across both
 * Google AI SDK and Vertex AI SDK middleware implementations.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
        var _a;
        this.logLevel = ((_a = process.env.REVENIUM_LOG_LEVEL) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || "INFO";
    }
    Logger.prototype.shouldLog = function (level) {
        var levels = ["DEBUG", "INFO", "WARNING", "ERROR"];
        var currentLevel = levels.indexOf(this.logLevel);
        var messageLevel = levels.indexOf(level);
        return messageLevel >= currentLevel;
    };
    Logger.prototype.formatMessage = function (level, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var timestamp = new Date().toISOString();
        var prefix = "[".concat(timestamp, "] [Revenium] [").concat(level, "]");
        if (args.length > 0) {
            return "".concat(prefix, " ").concat(message, " ").concat(args
                .map(function (arg) {
                return typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg);
            })
                .join(" "));
        }
        return "".concat(prefix, " ").concat(message);
    };
    Logger.prototype.debug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.shouldLog("DEBUG")) {
            console.debug(this.formatMessage.apply(this, __spreadArray(["DEBUG", message], args, false)));
        }
    };
    Logger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.shouldLog("INFO")) {
            console.info(this.formatMessage.apply(this, __spreadArray(["INFO", message], args, false)));
        }
    };
    Logger.prototype.warning = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.shouldLog("WARNING")) {
            console.warn(this.formatMessage.apply(this, __spreadArray(["WARNING", message], args, false)));
        }
    };
    Logger.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.shouldLog("ERROR")) {
            console.error(this.formatMessage.apply(this, __spreadArray(["ERROR", message], args, false)));
        }
    };
    Logger.prototype.setLogLevel = function (level) {
        var validLevels = ["DEBUG", "INFO", "WARNING", "ERROR"];
        if (validLevels.includes(level.toUpperCase())) {
            this.logLevel = level.toUpperCase();
        }
        else {
            this.warning("Invalid log level: ".concat(level, ". Using INFO instead."));
            this.logLevel = "INFO";
        }
    };
    Logger.prototype.getLogLevel = function () {
        return this.logLevel;
    };
    return Logger;
}());
exports.Logger = Logger;
