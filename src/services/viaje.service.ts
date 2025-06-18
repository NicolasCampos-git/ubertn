import { Viaje } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { SolicitudViajeService } from "./solicitud.service";
import prisma from "../lib/prisma";
import { RegistrarViajeDto } from "../dtos/registrar-viaje.dto";


@injectable()
export class ViajeService{

    constructor(
        @inject(SolicitudViajeService) private readonly solicitudService: SolicitudViajeService
    ){}
    
    //Para poder registrar un viaje con multiples solicitudes hace falta cambiar la relacion en el schema.
    async registrarViaje(data: RegistrarViajeDto, choferId: string): Promise<Viaje | null> {
        return null;
    }
    
}