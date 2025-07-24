import dotenv from "dotenv";
import { Viaje } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { SolicitudViajeService } from "./solicitud.service";
import prisma from "../lib/prisma";
import { RegistrarViajeDto } from "../dtos/registrar-viaje.dto";
import { UsuarioService } from "./usuario.service";
import { NotFoundError } from "../excepciones/not-found.error";
import { ValidationError } from "../excepciones/validation.error";
import axios from "axios";
import { Ruta } from "../types/ruta";
import { IniciarViajeDto } from "../dtos/iniciar-viaje.dto";
import { ViajeController } from "../controllers/viaje.controller";

dotenv.config();
const ORS_BASE_URL = "https://api.openrouteservice.org/v2/directions";
const PROFILE = "driving-car";
const apiKey = process.env.ORS_API_KEY;

@injectable()
export class ViajeService{
    


    constructor(
        @inject(SolicitudViajeService) private readonly solicitudService: SolicitudViajeService,
        @inject(UsuarioService) private readonly usuarioService: UsuarioService
    ){}

    //Ver dto para los datos parciales.
    async listasViajesPendientes(choferId: string){

        this.usuarioService.buscarPorId(choferId);
        
        return prisma.viaje.findMany({
            where : {
                choferId: choferId,
                estado: "PENDIENTE",
            },
            select: {
                fechaCreacion: true,
                estado: true,
                solicitudes: {
                    select: {
                        solicitud: {
                            select: {
                                pasajero: {
                                    select: {
                                        telefono: true,
                                        perfil: {
                                            select: {
                                                nombre: true,
                                                apellido: true
                                            }
                                        }
                                    }
                                },
                                ubicacionOrigen: {
                                    select: {
                                        latitud: true,
                                        longitud: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    async buscarVIajePorId(viajeId: string):Promise<Viaje>{
        const viaje = await prisma.viaje.findFirst({
          where: { id: viajeId },
        });
        if (!viaje) {
          throw new NotFoundError("Viaje no encontrado.");
        }
        return viaje;

    }
    
    
    async registrarViaje(data: RegistrarViajeDto, choferId: string): Promise<Viaje | null> {
        

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

    async cancelarViaje(viajeId: string, choferId: string): Promise<Viaje>{
        
        //Aca se puede separar para hacer mas limpio el codigo.
        const viaje = await this.buscarVIajePorId(viajeId);


        if(viaje.estado === "EN_CAMINO" || viaje.estado==="FINALIZADO"){
            throw new ValidationError("No es posible cancelar el viaje seleccionado.");
        }

        //TENGO QUE VER COMO REVERTIR LAS SOLICITUDES VINCULADAS AL VIAJE.
        //SI SE REVIERTEN A "PEDIENTE_ACEPTACION" O "CANCELADA".
        

        return prisma.viaje.update({
            where: {id: viajeId},
            data: {
                estado: "CANCELADO"
            }
        });
    }

    //FALTA ASIGNAR FUNCIONALIDAD PARA INDICAR QUE SE RECOGIO A DETERMINADO PASAJERO.
    //FALTA OPTIMIZAR LA RUTA USANDO DIJKSTRA.
    //FALTA FINALIZAR EL VIAJE.
    async iniciarViaje(data: IniciarViajeDto){
       

        let rutaDef: Ruta = {
            inicio: [data.ubicacionInicio.latitud,data.ubicacionInicio.longitud],
            solicitudes: [],
            fin: [ -63.216652,-32.408644] //coordenadas de la facu.
        };

        await this.buscarVIajePorId(data.viajeId);


        //Ver que validaciones son necesarias.
        const paradasViaje = await prisma.viajeSolicitud.findMany({
            where: {
                viajeId: data.viajeId
            },
            select: {
                solicitud: {
                    select: {
                        ubicacionOrigen: {
                            select: {
                                longitud: true,
                                latitud: true
                            }
                        }
                    }
                }
            }
        });

        //Separar logia para poder hacerlo de manera mas eficiente.
        for (let i = 0; i< paradasViaje.length; i++ ){
            rutaDef.solicitudes.push([
                paradasViaje[i].solicitud.ubicacionOrigen.latitud.toNumber(),
                paradasViaje[i].solicitud.ubicacionOrigen.longitud.toNumber()
            ])
        }
        
        
        const ruta = await this.obtenerRuta([rutaDef.inicio, ...rutaDef.solicitudes, rutaDef.fin]);

        return ruta;
    }

    async obtenerRuta(coordinates: number[][]){
        const response = await axios.post(
            `${ORS_BASE_URL}/${PROFILE}/geojson`,
            {
              coordinates,
            },
            {
              headers: {
                Authorization: apiKey,
                "Content-Type": "application/json",
              },
            }
        );
        
        if(!response){ throw new ValidationError("Error en la obtencion de la ruta")}
        

        return response.data;
    }
    
}