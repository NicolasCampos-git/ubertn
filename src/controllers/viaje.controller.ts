import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { ViajeService } from "../services/viaje.service";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "../types/auth";
import { RegistrarViajeDto } from "../dtos/registrar-viaje.dto";
import { IniciarViajeDto } from "../dtos/iniciar-viaje.dto";



@injectable()
export class ViajeController {
    constructor(@inject(ViajeService) private readonly viajeService: ViajeService){}

    async registrarViaje(req: Request, res: Response, next: NextFunction){
        try{
            //Ver como obtener el id a traves del token de manera optima.
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

    async cancelarViaje(req: Request, res: Response, next: NextFunction){
        try{
            //Ver como obtener el id a traves del token de manera optima.
            const token = req.headers.authorization!.split(" ")[1];    
            const payload = jwt.verify(token, 'prueba') as JwtPayload;

            const { id } = req.params;

            const viaje = await this.viajeService.cancelarViaje(id, payload.id);
            
            return res.status(200).json({
                success: true,
                data: viaje,
                message: "Viage cancelado con exito."
            });

        }catch(error){
            next(error);
        }
    }

    async iniciarViaje(req: Request, res: Response, next: NextFunction){
        try{
            const data  = req.body as IniciarViajeDto;
            const viaje = await this.viajeService.iniciarViaje(data);
            return res.status(200).json({
                success: true,
                data: {
                    distancia: (viaje.features[0].properties.summary.distance / 1000).toFixed(2),
                    duracion: (viaje.features[0].properties.summary.duration / 60).toFixed(1),
                    ruta: viaje
                },
                message: "Ruta de viaje obtenida con exito"
            });
        }catch(error){

        }
    }

    async listaViajesPendientes(req: Request, res: Response, next: NextFunction){
        try{
            //Ver como obtener el id a traves del token de manera optima.
            const token = req.headers.authorization!.split(" ")[1];    
            const payload = jwt.verify(token, 'prueba') as JwtPayload;
            

            const viajesPendientes = await this.viajeService.listasViajesPendientes(payload.id);
           
            return res.status(200).json({
                success: true,
                data: viajesPendientes,
                message: "Viajes pendientes cargados con exito."
            });


        }catch(error){
            next(error);
        }
    }

    
}