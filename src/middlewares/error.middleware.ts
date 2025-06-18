import { ValidationError } from "../excepciones/validation.exception";
import { AuthError } from "../excepciones/auth.exception";
import { Request, Response, NextFunction } from "express";
import { DuplicationError } from "../excepciones/duplicacion.exception";




export function captuarErrores(
  err: any, 
  _req: Request, 
  res: Response, 
  _next: NextFunction
): void {
  if (err instanceof AuthError) {
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

  if(err instanceof DuplicationError){
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