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
exports.SolicitudViajeService = void 0;
const tsyringe_1 = require("tsyringe");
const usuario_service_1 = require("./usuario.service");
const prisma_1 = __importDefault(require("../lib/prisma"));
const not_found_error_1 = require("../excepciones/not-found.error");
const validation_error_1 = require("../excepciones/validation.error");
let SolicitudViajeService = class SolicitudViajeService {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }
    registrarSolicitudViaje(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.usuarioService.buscarPorId(dto.pasajeroId);
            //VER COMo SE MANEJA LA HORA.
            if (new Date(dto.horarioLlegada).getTime() <= Date.now()) {
                throw new validation_error_1.ValidationError("La hora de llegada no es correspondiente.");
            }
            //Una validacion adicional seria validar que la direccion exista
            //haciendo uso de google maps o alguna api.
            return prisma_1.default.solicitudViaje.create({
                data: {
                    horaLlegadaDeseada: new Date(dto.horarioLlegada),
                    tipoDeVehiculo: dto === null || dto === void 0 ? void 0 : dto.tipoVehiculo,
                    ubicacionOrigen: {
                        create: {
                            latitud: dto.ubicacionOrigen.latitud,
                            longitud: dto.ubicacionOrigen.longitud
                        }
                    },
                    pasajero: {
                        connect: {
                            id: dto.pasajeroId
                        }
                    },
                }
            });
        });
    }
    listarSolicitudesDeViajePorUsuario(idUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const solicitudes = yield prisma_1.default.solicitudViaje.findMany({
                where: {
                    pasajeroId: idUsuario,
                },
            });
            return solicitudes;
        });
    }
    buscarSolicitudPorIdUsuario(idSolicitud, usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const solicitud = yield prisma_1.default.solicitudViaje.findUnique({
                where: {
                    id: idSolicitud,
                    pasajeroId: usuarioId
                }
            });
            if (!solicitud) {
                throw new not_found_error_1.NotFoundError("Solicitud de viaje no encontrada.");
            }
            return solicitud;
        });
    }
    buscarSolicitudPorId(idSolicitud) {
        return __awaiter(this, void 0, void 0, function* () {
            const solicitud = yield prisma_1.default.solicitudViaje.findUnique({
                where: {
                    id: idSolicitud,
                }
            });
            if (!solicitud) {
                throw new not_found_error_1.NotFoundError("Solicitud de viaje no encontrada.");
            }
            return solicitud;
        });
    }
    cancelarSolicitudDeViaje(idSolicitud, usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const solicitud = yield this.buscarSolicitudPorIdUsuario(idSolicitud, usuarioId);
            if (solicitud.estado === "CANCELADA") {
                throw new validation_error_1.ValidationError("La solicitud ya esta cancelada.");
            }
            return prisma_1.default.solicitudViaje.update({
                where: {
                    id: idSolicitud
                },
                data: {
                    estado: "CANCELADA",
                    fueCancelada: true
                }
            });
        });
    }
    listarSolicitudesPendientes() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.solicitudViaje.findMany({
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
        });
    }
    aceptarSolicitudViaje(solicitudId) {
        return __awaiter(this, void 0, void 0, function* () {
            const solicitud = yield this.buscarSolicitudPorId(solicitudId);
            if (solicitud.estado !== "PENDIENTE_CONFIRMACION") {
                throw new validation_error_1.ValidationError("No es posible aceptar la solicitud de viaje seleccioada.");
            }
            return prisma_1.default.solicitudViaje.update({
                where: {
                    id: solicitudId
                },
                data: {
                    estado: "ACEPTADA",
                    fueAceptada: true,
                },
            });
        });
    }
};
exports.SolicitudViajeService = SolicitudViajeService;
exports.SolicitudViajeService = SolicitudViajeService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(usuario_service_1.UsuarioService)),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService])
], SolicitudViajeService);
