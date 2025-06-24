"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captuarErrores = captuarErrores;
const validation_error_1 = require("../excepciones/validation.error");
const auth_error_1 = require("../excepciones/auth.error");
const duplicacion_error_1 = require("../excepciones/duplicacion.error");
function captuarErrores(err, _req, res, _next) {
    if (err instanceof auth_error_1.AuthError) {
        res.status(401).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err instanceof validation_error_1.ValidationError) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err instanceof duplicacion_error_1.DuplicationError) {
        res.status(404).json({
            success: false,
            message: err.message,
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : "Error interno del servidor",
    });
}
