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
const auth_service_1 = require("../auth/auth.service");
const router = (0, express_1.Router)();
const services = tsyringe_1.container.resolve(auth_service_1.AuthService);
router.post("/registrarse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield services.registrar(req.body);
        res.status(201).json(usuario);
    }
    catch (error) {
        res.status(400).json();
    }
}));
exports.default = router;
