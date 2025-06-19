import { Viaje } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { SolicitudViajeService } from "./solicitud.service";
import prisma from "../lib/prisma";
import { RegistrarViajeDto } from "../dtos/registrar-viaje.dto";
import { UsuarioService } from "./usuario.service";


@injectable()
export class ViajeService{

    constructor(
        @inject(SolicitudViajeService) private readonly solicitudService: SolicitudViajeService,
        @inject(UsuarioService) private readonly usuarioService: UsuarioService
    ){}
    
    //Para poder registrar un viaje con multiples solicitudes hace falta cambiar la relacion en el schema.
    async registrarViaje(data: RegistrarViajeDto, choferId: string): Promise<Viaje | null> {
        //Faltan las validaciones.

        return prisma.$transaction(async (tx) => {
            
            //Aca se podria agregar para validar que es un chofer valido.
            //Por ahora solo valida que sea un usuario registrado, independiente del rol.
            //Aunque ya esta validado el rol en el token.
            await this.usuarioService.buscarPorId(choferId);

            //Esto se podria hacer de manera asincrona usando un promise.all
            for (let i = 0;  i < data.solicitudes.length ; i++){
                await this.solicitudService.aceptarSolicitudViaje(data.solicitudes[i]);
            }

            const viaje = await prisma.viaje.create({
                data: {
                    chofer: {
                        connect: {
                            id: choferId
                        }
                    },
                    solicitudes: {
                        create: data.solicitudes.map((solicitud: string) => ({
                            
                            solicitud: {
                                connect: {
                                    id: solicitud
                                }
                            }
                        }))
                    }
                }
            });

            return viaje;
        });
    }
    
}