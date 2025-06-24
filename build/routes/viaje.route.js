"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const viaje_controller_1 = require("../controllers/viaje.controller");
const rol_middleware_1 = require("../middlewares/rol.middleware");
const router = (0, express_1.Router)();
const controller = tsyringe_1.container.resolve(viaje_controller_1.ViajeController);
router.post("/registrar-viaje", (0, rol_middleware_1.autorizarUsuario)("CONDUCTOR"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.registrarViaje(req, res, next);
}));
router.delete("/cancelar-viaje", (0, rol_middleware_1.autorizarUsuario)("CONDUCTOR"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.cancelarViaje(req, res, next);
}));
router.post("/iniciar-viaje/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.iniciarViaje(req, res, next);
}));
exports.default = router;
