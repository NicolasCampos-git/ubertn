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
exports.SolicitudViajeController = void 0;
const tsyringe_1 = require("tsyringe");
const solicitud_service_1 = require("../services/solicitud.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let SolicitudViajeController = class SolicitudViajeController {
    constructor(solicitudService) {
        this.solicitudService = solicitudService;
    }
    registrarSolicitud(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const nuevaSolicitud = yield this.solicitudService.registrarSolicitudViaje(data);
                return res.status(201).json({
                    success: true,
                    data: nuevaSolicitud,
                    message: "Nueva solicitud de viaje registrada con exito."
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    listarSolicitudes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const solicitudes = yield this.solicitudService.listarSolicitudesDeViajePorUsuario(id);
                return res.status(200).json({
                    data: solicitudes
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    listaSolicitudesPendientes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listado = yield this.solicitudService.listarSolicitudesPendientes();
                return res.status(200).json(listado);
            }
            catch (error) {
                next(error);
            }
        });
    }
    cancelarSolicitudDeVaije(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                //ESTA PARTE SE ENCARGA DE VALIDAR QUE LA SOLICITUD PERTENEZCA AL PASAJERO.
                //deneria cabiarlo para que sea mas limpio o incluirlo en el middleware.
                const token = req.headers.authorization.split(" ")[1];
                const payload = jsonwebtoken_1.default.verify(token, 'prueba');
                const solicitud = yield this.solicitudService.cancelarSolicitudDeViaje(id, payload.id);
                return res.status(200).json({
                    success: true,
                    data: solicitud,
                    message: "Solicitud de viaje cancelada con exito."
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Hubo un problema al cancelar solicitud de viaje."
                });
            }
        });
    }
};
exports.SolicitudViajeController = SolicitudViajeController;
exports.SolicitudViajeController = SolicitudViajeController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(solicitud_service_1.SolicitudViajeService)),
    __metadata("design:paramtypes", [solicitud_service_1.SolicitudViajeService])
], SolicitudViajeController);
