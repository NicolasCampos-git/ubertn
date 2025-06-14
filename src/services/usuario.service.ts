import { Usuario } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import  bcrypt  from "bcrypt"
import { RegistrarUsuarioDto } from "../dtos/registrar-usuario.dto";
import { error } from "console";

@injectable()
export class UsuarioService {
    

    async buscarPorId(usuarioId: string): Promise<Usuario | null>{
        const usuario = await prisma.usuario.findFirst({
            where: {
                id: usuarioId
            }
        });

        if(!usuario){
            throw new Error("Usuario no encontrado.");
        }

        return usuario;
    }

    async registrarUsuario(data: RegistrarUsuarioDto): Promise<Usuario>{
        const pass = await this.hashPassword(data.contrasena);

        return  prisma.usuario.create({
            data: {
                email: data.email,
                password: pass,
                telefono: data.telefono,
                rol: data.rol,
                perfil: {
                    create: {
                        nombre: data.nombre,
                        apellido: data.apellido,
                        legajo: data.legajo,
                        dni: data.dni,
                        biografia: data.biografia
                    }
                }
                
            }
        });
    }

    async buscarPorEmail(emailUsuario: string): Promise<Usuario>{
        const usuario =  prisma.usuario.findFirstOrThrow({
            where: {
                email: emailUsuario
            }
        });

        if(!usuario){
            throw new Error("Usuaro no encontrado.");
        }


        return usuario;
    }

    async crearUsuarioConPerfil(): Promise<Usuario | null>{
        return null;
    }

    private async hashPassword(pass: string): Promise<string>{
            const hashedPassword = await bcrypt.hash(pass, 10);
            return hashedPassword;
    }
}