import { inject, injectable } from "tsyringe";
import { UsuarioService } from "../services/usuario.service";
import { Request, Response, NextFunction }  from "express";
import { RegistrarVehiculoDto } from "../dtos/registrar-vehiculo.dto";
import prisma from "../lib/prisma";


@injectable()
export class UsuarioController{
    constructor(@inject(UsuarioService)private readonly usuarioService: UsuarioService){}

    async registrarVehiculo(req: Request, res: Response, next: NextFunction){
        try{
            const data = req.body as RegistrarVehiculoDto;
            const nuevoVehiculo = await this.usuarioService.registrarVehiculo(data);
            return res.status(201).json({
                success: true,
                data: nuevoVehiculo,
                message: "Nueva vehiculo registrado con exito."
            });
        }catch(error){
            next(error);
        }
    }

}