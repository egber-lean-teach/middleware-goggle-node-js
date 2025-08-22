"use strict";
/**
 * Common exceptions for Google AI middleware.
 *
 * This module contains exception classes used across both Google AI SDK
 * and Vertex AI SDK middleware implementations.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeExtract = exports.StreamTrackingError = exports.MiddlewareActivationError = exports.TokenCountingError = exports.ConfigurationError = exports.APIResponseError = exports.MeteringError = void 0;
var MeteringError = /** @class */ (function (_super) {
    __extends(MeteringError, _super);
    /** Base exception for metering-related errors. */
    function MeteringError(message, cause) {
        var _this = _super.call(this, message) || this;
        _this.cause = cause;
        _this.name = 'MeteringError';
        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, MeteringError);
        }
        return _this;
    }
    return MeteringError;
}(Error));
exports.MeteringError = MeteringError;
var APIResponseError = /** @class */ (function (_super) {
    __extends(APIResponseError, _super);
    /** Exception for API response errors. */
    function APIResponseError(message, statusCode, responseData, cause) {
        var _this = _super.call(this, message, cause) || this;
        _this.statusCode = statusCode;
        _this.responseData = responseData;
        _this.name = 'APIResponseError';
        return _this;
    }
    return APIResponseError;
}(MeteringError));
exports.APIResponseError = APIResponseError;
var ConfigurationError = /** @class */ (function (_super) {
    __extends(ConfigurationError, _super);
    /** Exception for configuration errors. */
    function ConfigurationError(message, cause) {
        var _this = _super.call(this, message, cause) || this;
        _this.name = 'ConfigurationError';
        return _this;
    }
    return ConfigurationError;
}(MeteringError));
exports.ConfigurationError = ConfigurationError;
var TokenCountingError = /** @class */ (function (_super) {
    __extends(TokenCountingError, _super);
    /** Exception for token counting errors. */
    function TokenCountingError(message, cause) {
        var _this = _super.call(this, message, cause) || this;
        _this.name = 'TokenCountingError';
        return _this;
    }
    return TokenCountingError;
}(MeteringError));
exports.TokenCountingError = TokenCountingError;
var MiddlewareActivationError = /** @class */ (function (_super) {
    __extends(MiddlewareActivationError, _super);
    /** Exception for middleware activation errors. */
    function MiddlewareActivationError(message, cause) {
        var _this = _super.call(this, message, cause) || this;
        _this.name = 'MiddlewareActivationError';
        return _this;
    }
    return MiddlewareActivationError;
}(MeteringError));
exports.MiddlewareActivationError = MiddlewareActivationError;
var StreamTrackingError = /** @class */ (function (_super) {
    __extends(StreamTrackingError, _super);
    /** Exception for stream tracking errors. */
    function StreamTrackingError(message, cause) {
        var _this = _super.call(this, message, cause) || this;
        _this.name = 'StreamTrackingError';
        return _this;
    }
    return StreamTrackingError;
}(MeteringError));
exports.StreamTrackingError = StreamTrackingError;
/**
 * Safe extraction utility functions for error handling.
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
