import { inject, injectable } from "tsyringe";
import { ViajeService } from "../services/viaje.service";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../types/auth";
import jwt from 'jsonwebtoken';
import { RegistrarViajeDto } from "../dtos/registrar-viaje.dto";



@injectable()
export class ViajeController {
    constructor(@inject(ViajeService) private readonly viajeService: ViajeService){}

    async registrarViaje(req: Request, res: Response, next: NextFunction){
        try{
            
            const token = req.headers.authorization!.split(" ")[1];
                    
            const payload = jwt.verify(token, 'prueba') as JwtPayload;
            
            const data = req.body as RegistrarViajeDto;
           
            
            
            const viaje = await this.viajeService.registrarViaje(data, payload.id);

            return res.status(200).json({
                success: true,
                data: viaje,
                message: "Viage registrado con exito."
            });
        }catch(error){
            next(error);
        }
    }
    
}