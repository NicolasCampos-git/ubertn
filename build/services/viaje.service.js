"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViajeService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const tsyringe_1 = require("tsyringe");
const solicitud_service_1 = require("./solicitud.service");
const prisma_1 = __importDefault(require("../lib/prisma"));
const usuario_service_1 = require("./usuario.service");
const not_found_error_1 = require("../excepciones/not-found.error");
const validation_error_1 = require("../excepciones/validation.error");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const ORS_BASE_URL = "https://api.openrouteservice.org/v2/directions";
const PROFILE = "driving-car";
const apiKey = process.env.ORS_API_KEY;
let ViajeService = class ViajeService {
    constructor(solicitudService, usuarioService) {
        this.solicitudService = solicitudService;
        this.usuarioService = usuarioService;
    }
    //Para poder registrar un viaje con multiples solicitudes hace falta cambiar la relacion en el schema.
    registrarViaje(data, choferId) {
        return __awaiter(this, void 0, void 0, function* () {
            //Faltan las validaciones.
            return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                //Aca se podria agregar para validar que es un chofer valido.
                //Por ahora solo valida que sea un usuario registrado, independiente del rol.
                //Aunque ya esta validado el rol en el token.
                yield this.usuarioService.buscarPorId(choferId);
                //Esto se podria hacer de manera asincrona usando un promise.all
                for (let i = 0; i < data.solicitudes.length; i++) {
                    yield this.solicitudService.aceptarSolicitudViaje(data.solicitudes[i]);
                }
                const viaje = yield prisma_1.default.viaje.create({
                    data: {
                        chofer: {
                            connect: {
                                id: choferId
                            }
                        },
                        solicitudes: {
                            create: data.solicitudes.map((solicitud) => ({
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
            }));
        });
    }
    cancelarViaje(viajeId, choferId) {
        return __awaiter(this, void 0, void 0, function* () {
            //Aca se puede separar para hacer mas limpio el codigo.
            const viaje = yield prisma_1.default.viaje.findFirst({
                where: { id: viajeId }
            });
            if (!viaje) {
                throw new not_found_error_1.NotFoundError("Viaje no encontrado.");
            }
            if (viaje.estado === "EN_CAMINO" || viaje.estado === "FINALIZADO") {
                throw new validation_error_1.ValidationError("No es posible cancelar el viaje seleccionado.");
            }
            return prisma_1.default.viaje.update({
                where: { id: viajeId },
                data: {
                    estado: "CANCELADO"
                }
            });
        });
    }
    //FALTA TERMINAR LA FUNCIONALIDAD DEL CALCULO DE LA RUTA DEL VIAJE
    //FALTA ASIGNAR FUNCIONALIDAD PARA INDICAR QUE SE RECOGIO A DETERMINADO PASAJERO.
    //FALTA OPTIMIZAR LA RUTA USANDO DIJKSTRA.
    //FALTA FINALIZAR EL VIAJE.
    iniciarViaje(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let rutaDef = {
                inicio: [data.ubicacionInicio.latitud, data.ubicacionInicio.longitud],
                solicitudes: [],
                fin: [-63.216652, -32.408644]
            };
            const viaje = yield prisma_1.default.viaje.findFirst({
                where: { id: data.viajeId }
            });
            if (!viaje) {
                throw new not_found_error_1.NotFoundError("Viaje no encontrado.");
            }
            const paradasViaje = yield prisma_1.default.viajeSolicitud.findMany({
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
            for (let i = 0; i < paradasViaje.length; i++) {
                rutaDef.solicitudes.push([
                    paradasViaje[i].solicitud.ubicacionOrigen.latitud.toNumber(),
                    paradasViaje[i].solicitud.ubicacionOrigen.longitud.toNumber()
                ]);
            }
            const ruta = yield this.obtenerRuta([rutaDef.inicio, ...rutaDef.solicitudes, rutaDef.fin]);
            return ruta;
        });
    }
    obtenerRuta(coordinates) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${ORS_BASE_URL}/${PROFILE}/geojson`, {
                coordinates,
            }, {
                headers: {
                    Authorization: apiKey,
                    "Content-Type": "application/json",
                },
            });
            if (!response) {
                throw new validation_error_1.ValidationError("Error en la obtencion de la ruta");
            }
            return response.data;
        });
    }
};
exports.ViajeService = ViajeService;
exports.ViajeService = ViajeService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(solicitud_service_1.SolicitudViajeService)),
    __param(1, (0, tsyringe_1.inject)(usuario_service_1.UsuarioService)),
    __metadata("design:paramtypes", [solicitud_service_1.SolicitudViajeService,
        usuario_service_1.UsuarioService])
], ViajeService);
