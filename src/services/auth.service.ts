import dotenv from 'dotenv';
dotenv.config();
import { inject, injectable } from "tsyringe";
import { RegistrarUsuarioDto } from "../dtos/registrar-usuario.dto";
import prisma from "../lib/prisma";
import { LoginDto } from "../dtos/login.dto";
import { Usuario } from "@prisma/client";
import  bcrypt  from "bcrypt"
import {JwtPayload} from "../types/auth";
import jwt from 'jsonwebtoken';
import { AuthError } from '../excepciones/auth.exception';
import { UsuarioService } from './usuario.service';
import { ValidationError } from '../excepciones/validation.exception';





@injectable()
export class AuthService {
    
    constructor(@inject(UsuarioService) private readonly usuarioService: UsuarioService){}

    async registrar(dataDto: RegistrarUsuarioDto): Promise<Usuario | null> {

        

        //Se podria separar en un metodo.
        await Promise.all([
            this.validarCorreo(dataDto.email),
            this.validarDni(dataDto.dni),
            this.validarLegajo(dataDto.legajo)
        ]);

        const usuario = await this.usuarioService.registrarUsuario(dataDto);
        
        //No deberia devolver datos sencibles.
        return usuario;
    }

    async login(dataDto: LoginDto): Promise<string>{

        const usuario = await this.usuarioService.buscarPorEmail(dataDto.email);
        
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
            throw new ValidationError("La direccion de correo electronico ya se encuentra registrado");
        }

        return true;
    }

    private async validarDni(dni: string): Promise<boolean>{
        const perfil = prisma.perfil.findFirst({
            where: {dni: dni }
        });

        if(await perfil){
            throw new ValidationError("El numero de indentidad ingresado ya se encuentra registrado");
        }

        return true;
    }

    private async validarLegajo(legajo: string): Promise<boolean>{
        const perfil = prisma.perfil.findFirst({
            where: {legajo: legajo}
        });

        if(await perfil){
            throw new ValidationError("El legajo ingresado ya se encuentra registrado");
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
            throw new AuthError("Email o contrasena incorrecta");
        }
    }



}