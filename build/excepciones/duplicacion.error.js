"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicationError = void 0;
class DuplicationError extends Error {
    constructor(message, success = false) {
        super(message);
        this.success = success;
    }
}
exports.DuplicationError = DuplicationError;
