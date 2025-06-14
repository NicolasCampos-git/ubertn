import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types/auth";
import jwt from 'jsonwebtoken';


export function autorizarUsuario(...roles: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new Error( "No token provided" );
        }

        
        const payload = jwt.verify(token, 'prueba') as JwtPayload;
        
        if(!roles.includes(payload.rol)){
            throw new Error("Acceso denegado");
            
        }
        

        next()

    }
}