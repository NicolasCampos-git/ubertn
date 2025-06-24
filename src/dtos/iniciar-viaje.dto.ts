import { IsNotEmpty, IsUUID } from "class-validator";
import { UbicacionOrigen } from "./ubicacion-origen.dto";


export class IniciarViajeDto{

    @IsNotEmpty()
    @IsUUID()
    viajeId!: string;

    
    ubicacionInicio!: UbicacionOrigen;

}