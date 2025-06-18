import { IsArray, IsNotEmpty } from "class-validator";

export class RegistrarViajeDto{


    @IsNotEmpty()
    @IsArray()
    solicitudId!: string[];
}