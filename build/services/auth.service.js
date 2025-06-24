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
exports.AuthService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tsyringe_1 = require("tsyringe");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_error_1 = require("../excepciones/auth.error");
const usuario_service_1 = require("./usuario.service");
const validation_error_1 = require("../excepciones/validation.error");
let AuthService = class AuthService {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }
    registrar(dataDto) {
        return __awaiter(this, void 0, void 0, function* () {
            //Se podria separar en un metodo.
            yield Promise.all([
                this.validarCorreo(dataDto.email),
                this.validarDni(dataDto.dni),
                this.validarLegajo(dataDto.legajo)
            ]);
            const usuario = yield this.usuarioService.registrarUsuario(dataDto);
            //No deberia devolver datos sencibles.
            return usuario;
        });
    }
    login(dataDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield this.usuarioService.buscarPorEmail(dataDto.email);
            yield this.passIsValid(dataDto.contrasena, usuario.password);
            const token = yield this.generarToken(usuario.id, usuario.email, usuario.rol);
            return token;
        });
    }
    generarToken(usuarioId, email, rol) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = jsonwebtoken_1.default.sign({ id: usuarioId, email: email, rol: rol }, 'prueba', { expiresIn: '1h' });
            return token;
        });
    }
    validarCorreo(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = prisma_1.default.usuario.findFirst({
                where: { email: email }
            });
            if (yield usuario) {
                throw new validation_error_1.ValidationError("La direccion de correo electronico ya se encuentra registrado");
            }
            return true;
        });
    }
    validarDni(dni) {
        return __awaiter(this, void 0, void 0, function* () {
            const perfil = prisma_1.default.perfil.findFirst({
                where: { dni: dni }
            });
            if (yield perfil) {
                throw new validation_error_1.ValidationError("El numero de indentidad ingresado ya se encuentra registrado");
            }
            return true;
        });
    }
    validarLegajo(legajo) {
        return __awaiter(this, void 0, void 0, function* () {
            const perfil = prisma_1.default.perfil.findFirst({
                where: { legajo: legajo }
            });
            if (yield perfil) {
                throw new validation_error_1.ValidationError("El legajo ingresado ya se encuentra registrado");
            }
            return true;
        });
    }
    hashPassword(pass) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(pass, 10);
            return hashedPassword;
        });
    }
    passIsValid(pass, userPass) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValid = yield bcrypt_1.default.compare(pass, userPass);
            if (!isValid) {
                throw new auth_error_1.AuthError("Email o contrasena incorrecta");
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(usuario_service_1.UsuarioService)),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService])
], AuthService);
