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
exports.ViajeController = void 0;
const tsyringe_1 = require("tsyringe");
const viaje_service_1 = require("../services/viaje.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let ViajeController = class ViajeController {
    constructor(viajeService) {
        this.viajeService = viajeService;
    }
    registrarViaje(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Ver como obtener el id a traves del token de manera optima.
                const token = req.headers.authorization.split(" ")[1];
                const payload = jsonwebtoken_1.default.verify(token, 'prueba');
                const data = req.body;
                const viaje = yield this.viajeService.registrarViaje(data, payload.id);
                return res.status(200).json({
                    success: true,
                    data: viaje,
                    message: "Viage registrado con exito."
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    cancelarViaje(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Ver como obtener el id a traves del token de manera optima.
                const token = req.headers.authorization.split(" ")[1];
                const payload = jsonwebtoken_1.default.verify(token, 'prueba');
                const { id } = req.params;
                const viaje = yield this.viajeService.cancelarViaje(id, payload.id);
                return res.status(200).json({
                    success: true,
                    data: viaje,
                    message: "Viage cancelado con exito."
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    iniciarViaje(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const viaje = yield this.viajeService.iniciarViaje(data);
                return res.status(200).json({
                    success: true,
                    data: {
                        distancia: (viaje.features[0].properties.summary.distance / 1000).toFixed(2),
                        duracion: (viaje.features[1].properties.summary.duration / 60).toFixed(1),
                        ruta: viaje
                    },
                    message: "Ruta de viaje obtenida con exito"
                });
            }
            catch (error) {
            }
        });
    }
};
exports.ViajeController = ViajeController;
exports.ViajeController = ViajeController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(viaje_service_1.ViajeService)),
    __metadata("design:paramtypes", [viaje_service_1.ViajeService])
], ViajeController);
