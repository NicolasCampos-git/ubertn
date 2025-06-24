import { ValidationError } from "../excepciones/validation.error";
import { AuthError } from "../excepciones/auth.error";
import { Request, Response, NextFunction } from "express";
import { DuplicationError } from "../excepciones/duplicacion.error";




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