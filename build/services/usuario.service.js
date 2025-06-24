"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UsuarioService = void 0;
const tsyringe_1 = require("tsyringe");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_error_1 = require("../excepciones/auth.error");
const not_found_error_1 = require("../excepciones/not-found.error");
const duplicacion_error_1 = require("../excepciones/duplicacion.error");
let UsuarioService = class UsuarioService {
    buscarPorId(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield prisma_1.default.usuario.findFirst({
                where: {
                    id: usuarioId
                }
            });
            if (!usuario) {
                throw new not_found_error_1.NotFoundError("Usuario no encontrado.");
            }
            return usuario;
        });
    }
    registrarUsuario(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const pass = yield this.hashPassword(data.contrasena);
            return prisma_1.default.usuario.create({
                data: {
                    email: data.email,
                    password: pass,
                    telefono: data.telefono,
                    rol: data.rol,
                    perfil: {
                        create: {
                            nombre: data.nombre,
                            apellido: data.apellido,
                            legajo: data.legajo,
                            dni: data.dni,
                            biografia: data.biografia
                        }
                    }
                }
            });
        });
    }
    buscarPorEmail(emailUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = yield prisma_1.default.usuario.findUnique({
                where: {
                    email: emailUsuario
                }
            });
            if (!usuario) {
                throw new auth_error_1.AuthError("Correo o contrasena invalidos.");
            }
            return usuario;
        });
    }
    hashPassword(pass) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(pass, 10);
            return hashedPassword;
        });
    }
    registrarVehiculo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            //Deberia moverse a un metodo para hacerlo mas limpio.
            const validarPatente = yield prisma_1.default.vehiculo.findFirst({
                where: {
                    patente: data.patente
                }
            });
            if (validarPatente) {
                throw new duplicacion_error_1.DuplicationError("La patente ingresada ya se cuentra registrada.");
            }
            return prisma_1.default.vehiculo.create({
                data: {
                    patente: data.patente,
                    capacidad: data.capacidad,
                    tipoVehiculo: data.tipoVehiculo,
                    descripcion: data.descripcion,
                    conductor: {
                        connect: {
                            id: data.conductorId
                        }
                    }
                }
            });
        });
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, tsyringe_1.injectable)()
], UsuarioService);
