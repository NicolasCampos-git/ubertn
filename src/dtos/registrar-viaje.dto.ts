import { IsArray, IsNotEmpty } from "class-validator";

export class RegistrarViajeDto{


    @IsNotEmpty()
    @IsArray()
    solicitudes!: string[];
}