import { inject, injectable } from "tsyringe";
import { SolicitudViajeService } from "../services/solicitud.service";
import { Request, Response, NextFunction } from "express";
import { RegistrarSolicitudViajeDto } from "../dtos/registrar-solicitud-viaje.dto";
import { SolicitudViaje } from "@prisma/client";


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
            return res.status(400).json({
                success: false,
                message: "Ah ocurrido un error al solicitar un viaje."
            });
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
            return res.status(400).json({
                success: false,
                message: "Error al listar las solicitudes de viaje."
            });
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

            const solicitud = await this.solicitudService.cancelarSolicitudDeViaje(id);

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