import { ValidationError } from "../excepciones/validation.exception";
import { AuthException } from "../excepciones/auth.exception";
import { Request, Response, NextFunction } from "express";




export function captuarErrores(
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  if (err instanceof AuthException) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({ 
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