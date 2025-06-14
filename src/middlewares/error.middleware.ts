import { ValidationError } from "../excepciones/validation.exception";
import { AuthException } from "../excepciones/auth.exception";
import { Request, Response, NextFunction } from "express";




export function captuarErrores(err: any , _req: Request, res: Response, _next: NextFunction){
  if (err instanceof AuthException) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err instanceof Error ? err.message : "Error interno del servidor",
  });
}