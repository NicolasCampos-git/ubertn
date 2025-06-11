import { Rol } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";


export class RegistrarUsuarioDto {

    @IsNotEmpty()
    @IsEmail({}, { message: "El correo electronico debe tener un formato valido." })
    email!: string;

    //Aca deberia agregar una expresion regular que controle el tema de la contrasena.
    @IsNotEmpty()
    @IsString()
    contrasena!: string;

    //Aca deberia agregar una expresion regular que controle el tema del numero de telefono.
    @IsNotEmpty()
    @IsPhoneNumber()
    telefono!: string;

    //Aca deberia usar una expresion regular para proteger XSS.
    @IsNotEmpty()
    @IsString()
    nombre!: string;

    //Aca deberia usar una expresion regular para proteger XSS.
    @IsNotEmpty()
    @IsString()
    apellido!: string;

    //Buscar como usarlo de manera correcta.
    @IsNotEmpty()
    @IsString()
    legajo!: string;

    //Buscar como usarlo de manera correcta.
    @IsNotEmpty()
    @IsString()
    dni!: string;

    //Buscar como usarlo de manera correcta.
    @IsNotEmpty()
    @IsString()
    biografia!: string;
    
    //Buscar como usarlo de manera correcta.
    @IsNotEmpty()
    rol!: Rol;

    
}