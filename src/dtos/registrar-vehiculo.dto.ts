import { TipoVehiculo } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";


export class RegistrarVehiculoDto{

    @IsNotEmpty()
    @IsString()
    patente!: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    capacidad!: number;

    @IsNotEmpty()
    @IsEnum(TipoVehiculo)
    tipoVehiculo!: TipoVehiculo;

    @IsNotEmpty()
    @IsString()
    descripcion!: string;

    @IsNotEmpty()
    @IsUUID()
    conductorId!: string;
}