import dotenv from "dotenv";

import { SolicitudViaje} from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { UsuarioService } from "./usuario.service";
import { RegistrarSolicitudViajeDto } from "../dtos/registrar-solicitud-viaje.dto";
import prisma from "../lib/prisma";
import { NotFoundError } from "../excepciones/not-found.error";
import { ValidationError } from "../excepciones/validation.error";
import { UbicacionOrigen } from "../dtos/ubicacion-origen.dto";
import axios from "axios";

dotenv.config();
const ORS_BASE_URL = "https://api.openrouteservice.org/";
const apiKey = process.env.ORS_API_KEY;

@injectable()
export class SolicitudViajeService {

    constructor(@inject(UsuarioService) private readonly usuarioService: UsuarioService){}
    
    async registrarSolicitudViaje(dto: RegistrarSolicitudViajeDto): Promise<SolicitudViaje>{
        await this.usuarioService.buscarPorId(dto.pasajeroId);
        
        
        if( new Date(dto.horarioLlegada).getTime()<= Date.now()){
            throw new ValidationError("La hora de llegada no es valida.");
        }

        
        //Ver como usar los parametros que devuelve para hacer mas robusto.
        //Podria cambiar la forma de obtener las direcciones, en vez de usar punto en el mapa.
        //podria usar un punto de interes, para darle mejor uso a la api.
        await this.validarDireccion(dto.ubicacionOrigen);
        
        return prisma.solicitudViaje.create({
            data: {
                horaLlegadaDeseada: new Date(dto.horarioLlegada),
                tipoDeVehiculo: dto?.tipoVehiculo,
                ubicacionOrigen: {
                    create: {
                        longitud: dto.ubicacionOrigen.longitud,
                        latitud: dto.ubicacionOrigen.latitud

                    }
                },
                pasajero: {
                    connect: {
                        id: dto.pasajeroId
                    }
                },

                
            }
        });


    }

    async listarSolicitudesDeViajePorUsuario(idUsuario: string): Promise<SolicitudViaje[]>{
        
        const solicitudes = await prisma.solicitudViaje.findMany({
            where: {
                pasajeroId: idUsuario,
            },
        });
        
        return solicitudes;
    }

    async buscarSolicitudPorIdUsuario(idSolicitud: string, usuarioId: string): Promise<SolicitudViaje>{
        const solicitud = await prisma.solicitudViaje.findUnique({
            where: {
                id: idSolicitud,
                pasajeroId: usuarioId
            }
        });
        if(!solicitud){
            throw new NotFoundError("Solicitud de viaje no encontrada.");
        }
        return solicitud;
    }

    async buscarSolicitudPorId(idSolicitud: string): Promise<SolicitudViaje>{
        const solicitud = await prisma.solicitudViaje.findUnique({
            where: {
                id: idSolicitud,
            }
        });
        if(!solicitud){
            throw new NotFoundError("Solicitud de viaje no encontrada.");
        }
        return solicitud;
    }

    async cancelarSolicitudDeViaje(idSolicitud: string, usuarioId: string): Promise<SolicitudViaje>{
        const solicitud = await this.buscarSolicitudPorIdUsuario(idSolicitud, usuarioId);
        
        if(solicitud.estado === "CANCELADA"){
            throw new ValidationError("La solicitud ya esta cancelada.");
        }

        return prisma.solicitudViaje.update({
            where: {
                id: idSolicitud
            },
            data: {
                estado: "CANCELADA",
                fueCancelada: true
            }
        });
    }

    async listarSolicitudesPendientes(){
        return prisma.solicitudViaje.findMany({
            where: {
                estado: "PENDIENTE_CONFIRMACION"
            },
            select: {
              id: true,
              horaLlegadaDeseada: true,
              ubicacionOrigen: {
                select: {
                  latitud: true,
                  longitud: true
                }
              },
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
              
            },
            
          });
    }

    
    async aceptarSolicitudViaje(solicitudId: string): Promise<SolicitudViaje>{

        
        const solicitud = await this.buscarSolicitudPorId(solicitudId);

        if(solicitud.estado !== "PENDIENTE_CONFIRMACION"){
            throw new ValidationError("No es posible aceptar la solicitud de viaje seleccioada.");
        }


        return prisma.solicitudViaje.update({
            where: {
                id: solicitudId
            },
            data: {
                estado: "ACEPTADA",
                fueAceptada: true,
                
            },
            
        });

    }

    async validarDireccion(data: UbicacionOrigen): Promise<void>{
        try{
            const response = await axios.get(
            `${ORS_BASE_URL}/geocode/reverse`,
            {
                params: {
                    'api_key': apiKey,
                    'point.lon': data.longitud,
                    'point.lat': data.latitud
                    }
                }
            );

            if(!response){
                throw new ValidationError("Error en la ubicacion.");
            }
            
        }catch(error){
            throw new ValidationError("Error al validad direccion.");
        }
        
    }

    
    
    
}