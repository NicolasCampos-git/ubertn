"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(message, success = false) {
        super(message);
        this.success = success;
    }
}
exports.ValidationError = ValidationError;
