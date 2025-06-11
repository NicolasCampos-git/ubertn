import dotenv from 'dotenv';
dotenv.config();
import { injectable } from "tsyringe";
import { RegistrarUsuarioDto } from "../dtos/registrar-usuario.dto";
import prisma from "../lib/prisma";
import { LoginDto } from "../dtos/login.dto";
import { Usuario } from "@prisma/client";
import  bcrypt  from "bcrypt"
import {JwtPayload} from "../types/auth";
import jwt from 'jsonwebtoken';





@injectable()
export class AuthService {
    
    async registrar(dataDto: RegistrarUsuarioDto): Promise<Usuario | null> {

        

        //Se podria separar en un metodo.
        await Promise.all([
            this.validarCorreo(dataDto.email),
            this.validarDni(dataDto.dni),
            this.validarLegajo(dataDto.legajo)
        ]);

        //encripta la contrasena con un hash.
        const pass = await this.hashPassword(dataDto.contrasena);

        //Se deberia separar la logica de la creacion del usuario
        //usando inyeccion de depenencia para separar la logica.
        const usuario = await prisma.usuario.create({
            data: {
                email: dataDto.email,
                password: pass,
                telefono: dataDto.telefono,
                rol: dataDto.rol,
                perfil: {
                    create: {
                        nombre: dataDto.nombre,
                        apellido: dataDto.apellido,
                        legajo: dataDto.legajo,
                        dni: dataDto.dni,
                        biografia: dataDto.biografia
                    }
                }
                
            }
        });

        if(!usuario){
            throw new Error("Error al registrarse");
        }
        
        //No deberia devolver datos sencibles.
        return usuario;
        
    }

    async login(dataDto: LoginDto): Promise<string>{

        //La busqueda del usuario deberia ser mediante inyeccion de dependencia.
        const usuario = await prisma.usuario.findFirst(
            {where: { email: dataDto.email } }
        );

        if(!usuario){
            console.log("hola")
            throw new Error("Error");
        }
        
        await this.passIsValid(dataDto.contrasena, usuario!.password);

        const token = await this.generarToken(usuario!.id, usuario!.email, usuario!.rol);
        
        return token;
    }

    private async generarToken(usuarioId: string, email: string, rol: string): Promise<string>{

        const token = jwt.sign({ id: usuarioId, email: email, rol: rol} as JwtPayload, 'prueba', { expiresIn: '1h'} );

        return token;
    }
    

    private async validarCorreo(email: string): Promise<boolean>{
        const usuario = prisma.usuario.findFirst({
            where: {email: email}
        });

        if(await usuario){
            throw new Error("La direccion de correo electronico ya se encuentra registrado");
        }

        return true;
    }

    private async validarDni(dni: string): Promise<boolean>{
        const perfil = prisma.perfil.findFirst({
            where: {dni: dni }
        });

        if(await perfil){
            throw new Error("El numero de indentidad ingresado ya se encuentra registrado");
        }

        return true;
    }

    private async validarLegajo(legajo: string): Promise<boolean>{
        const perfil = prisma.perfil.findFirst({
            where: {legajo: legajo}
        });

        if(await perfil){
            throw new Error("El legajo ingresado ya se encuentra registrado");
        }

        return true;
    }


    private async hashPassword(pass: string): Promise<string>{
        const hashedPassword = await bcrypt.hash(pass, 10);
        return hashedPassword;
    }

    private async passIsValid(pass: string, userPass: string): Promise<void>{
        const isValid = await bcrypt.compare(pass, userPass )

        if(!isValid){
            throw new Error("Email o contrasena incorrecta");
        }
    }



}