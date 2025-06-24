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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarSolicitudViajeDto = void 0;
const client_1 = require("@prisma/client");
const ubicacion_origen_dto_1 = require("./ubicacion-origen.dto");
const class_validator_1 = require("class-validator");
class RegistrarSolicitudViajeDto {
}
exports.RegistrarSolicitudViajeDto = RegistrarSolicitudViajeDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RegistrarSolicitudViajeDto.prototype, "pasajeroId", void 0);
__decorate([
    (0, class_validator_1.IsEmpty)(),
    (0, class_validator_1.IsEnum)(client_1.TipoVehiculo),
    __metadata("design:type", String)
], RegistrarSolicitudViajeDto.prototype, "tipoVehiculo", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", String)
], RegistrarSolicitudViajeDto.prototype, "horarioLlegada", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", ubicacion_origen_dto_1.UbicacionOrigen)
], RegistrarSolicitudViajeDto.prototype, "ubicacionOrigen", void 0);
