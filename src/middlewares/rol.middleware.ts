import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/auth";
import jwt from 'jsonwebtoken';
import { AuthError } from "../excepciones/auth.error";


export function autorizarUsuario(...roles: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new AuthError( "No token provided" );
        }

        
        const payload = jwt.verify(token, 'prueba') as JwtPayload;
        
        if(!roles.includes(payload.rol)){
            throw new AuthError("Acceso denegado");
            
        }

        

        next()

    }
}