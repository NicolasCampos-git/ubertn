"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autorizarUsuario = autorizarUsuario;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_error_1 = require("../excepciones/auth.error");
function autorizarUsuario(...roles) {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            throw new auth_error_1.AuthError("No token provided");
        }
        const payload = jsonwebtoken_1.default.verify(token, 'prueba');
        if (!roles.includes(payload.rol)) {
            throw new auth_error_1.AuthError("Acceso denegado");
        }
        next();
    };
}
