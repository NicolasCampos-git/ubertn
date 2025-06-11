import { TipoVehiculo } from "@prisma/client";
import { UbicacionOrigen } from "./ubicacion-origen.dto";
import { IsDate, IsEmpty, IsEnum, IsObject, IsUUID } from "class-validator";


export class RegistrarSolicitudViajeDto {
    
    @IsUUID()
    pasajeroId!: string;

    @IsEmpty()
    @IsEnum(TipoVehiculo)
    tipoVehiculo?: TipoVehiculo;

    @IsDate()
    horarioLlegada!: string;

    @IsObject()
    ubicacionOrigen!: UbicacionOrigen;
    
}