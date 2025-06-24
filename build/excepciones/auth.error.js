"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = void 0;
class AuthError extends Error {
    constructor(message, success = false) {
        super(message);
        this.success = success;
    }
}
exports.AuthError = AuthError;
