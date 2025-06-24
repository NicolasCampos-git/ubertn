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
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
const controllers = tsyringe_1.container.resolve(auth_controller_1.AuthController);
/**
 * @swagger
 * components:
 *    securitySchemes:
 *      apiAuth:
 *        type: apiKey
 *        in: header
 *        name: token
 */
router.post("/registrarse", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controllers.registrarUsuario(req, res, next);
}));
router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield controllers.login(req, res, next);
}));
/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Obtener token de autenticacion.
 *    tags:
 *      - Auth
 *    responses:
 *      200:
 *        description: Devuelve un token de un usuario logueado.
 *      400:
 *        description: Devuelve un error generico de credenciales invalidas.
 *
 */
/**
 * @swagger
 * /api/auth/registrarse:
 *  post:
 *    summary: Registro de un nuevo usuario.
 *    tags:
 *      - Auth
 *    responses:
 *      200:
 *        description: Devuelve los datos del nuevo usuario registrado.
 *      400:
 *        description: Devuelve un error generico de un error al registrarse.
 *
 */
exports.default = router;
