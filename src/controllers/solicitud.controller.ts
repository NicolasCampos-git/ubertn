import { inject, injectable } from "tsyringe";
import { SolicitudViajeService } from "../services/solicitud.service";
import { Request, Response, NextFunction } from "express";
import { RegistrarSolicitudViajeDto } from "../dtos/registrar-solicitud-viaje.dto";
import { JwtPayload } from "../types/auth";
import jwt from 'jsonwebtoken';



@injectable()
export class SolicitudViajeController {
    constructor (
        @inject(SolicitudViajeService) private readonly solicitudService: SolicitudViajeService
    ){}

    async registrarSolicitud(req: Request, res: Response, next: NextFunction){
        try{
            const data = req.body as RegistrarSolicitudViajeDto;
            
            const nuevaSolicitud = await this.solicitudService.registrarSolicitudViaje(data);

            return res.status(201).json({
                success: true,
                data: nuevaSolicitud,
                message: "Nueva solicitud de viaje registrada con exito."
            });

        }catch(error){
            next(error);
        }
    }

    async listarSolicitudes(req: Request, res: Response, next: NextFunction){
        try{
            const { id } = req.params;
            const solicitudes = await this.solicitudService.listarSolicitudesDeViajePorUsuario(id);
            
            return res.status(200).json({
                data: solicitudes
            });

        }catch(error){
            next(error);
        }
    }

    async listaSolicitudesPendientes(req: Request, res: Response, next: NextFunction){
        try{
            const listado = await this.solicitudService.listarSolicitudesPendientes();
            return res.status(200).json(listado);

        }catch(error){
            next(error);

        }
    }

    async cancelarSolicitudDeVaije(req: Request, res: Response, next: NextFunction){
        try{
            
            const { id } = req.params;
            
            //ESTA PARTE SE ENCARGA DE VALIDAR QUE LA SOLICITUD PERTENEZCA AL PASAJERO.
            //deneria cabiarlo para que sea mas limpio o incluirlo en el middleware.
            const token = req.headers.authorization!.split(" ")[1];
        
            const payload = jwt.verify(token, 'prueba') as JwtPayload;
            


            const solicitud = await this.solicitudService.cancelarSolicitudDeViaje(id, payload.id);
            

            return res.status(200).json({
                success: true,
                data: solicitud,
                message: "Solicitud de viaje cancelada con exito."
            });

        }catch(error){
            return res.status(400).json({
                success: false,
                message: "Hubo un problema al cancelar solicitud de viaje."
            });
        }
    }

}