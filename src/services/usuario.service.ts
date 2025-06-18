import { Usuario, Vehiculo } from "@prisma/client";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import  bcrypt  from "bcrypt"
import { RegistrarUsuarioDto } from "../dtos/registrar-usuario.dto";
import { AuthError } from "../excepciones/auth.exception";
import { NotFoundError } from "../excepciones/not-found.exception";
import { RegistrarVehiculoDto } from "../dtos/registrar-vehiculo.dto";
import { DuplicationError } from "../excepciones/duplicacion.exception";

@injectable()
export class UsuarioService {
    

    async buscarPorId(usuarioId: string): Promise<Usuario | null>{
        const usuario = await prisma.usuario.findFirst({
            where: {
                id: usuarioId
            }
        });

        if(!usuario){
            throw new NotFoundError("Usuario no encontrado.");
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

    async buscarPorEmail(emailUsuario: string): Promise<Usuario|null>{
        
        const usuario =  await prisma.usuario.findUnique({
            where: {
                email: emailUsuario
            }
        });

        if(!usuario){
            throw new AuthError("Correo o contrasena invalidos.");
        }


        return usuario;
    }

    private async hashPassword(pass: string): Promise<string>{
            const hashedPassword = await bcrypt.hash(pass, 10);
            return hashedPassword;
    }

    async registrarVehiculo(data: RegistrarVehiculoDto): Promise<Vehiculo>{

        const validarPatente = await prisma.vehiculo.findFirst({
            where: {
                patente: data.patente
            }
        });
        
        if(validarPatente){
            throw new DuplicationError("La patente ingresada ya se cuentra registrada.");
        }


        return prisma.vehiculo.create({
            data: {
                patente: data.patente,
                capacidad: data.capacidad,
                tipoVehiculo: data.tipoVehiculo,
                descripcion: data.descripcion,
                conductor: {
                    connect: {
                        id: data.conductorId
                    }
                }
            }
        });
    }
}