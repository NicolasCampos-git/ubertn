"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message, success = false) {
        super(message);
        this.success = success;
    }
}
exports.NotFoundError = NotFoundError;
