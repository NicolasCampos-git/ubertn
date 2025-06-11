import { IsLatitude, IsLongitude, IsNotEmpty } from "class-validator"



export class UbicacionOrigen {

    @IsNotEmpty()
    @IsLatitude()
    latitud!: number

    @IsNotEmpty()
    @IsLongitude()
    longitud!: number
}