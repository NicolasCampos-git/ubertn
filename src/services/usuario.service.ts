import { Usuario } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";

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

    async buscarPorEmail(): Promise<Usuario | null>{
        return null;
    }

    async crearUsuarioConPerfil(): Promise<Usuario | null>{
        return null;
    }
}