import { IsLatitude, IsLongitude, IsNotEmpty } from "class-validator"



export class UbicacionOrigen {
    @IsNotEmpty()
    @IsLongitude()
    longitud!: number
    
    @IsNotEmpty()
    @IsLatitude()
    latitud!: number


}