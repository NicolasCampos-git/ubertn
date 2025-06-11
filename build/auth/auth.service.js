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
exports.AuthService = void 0;
const tsyringe_1 = require("tsyringe");
const supabase_1 = require("../lib/supabase");
const prisma_1 = __importDefault(require("../lib/prisma"));
const autogestion_frvm_1 = __importDefault(require("autogestion-frvm"));
const alumnos = [
    {
        nombre: "Nicolas",
        apellido: "Campos",
        legajo: "13115",
        dni: "41001355"
    },
];
let AuthService = class AuthService {
    registrar(dataDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validarDatosAlumno(dataDto, alumnos)) {
                throw new Error('usuario invalido');
            }
            const { data, error } = yield supabase_1.supabase.auth.signUp({
                email: dataDto.email,
                password: dataDto.contrasena,
                phone: dataDto.telefono
            });
            if (error) {
                throw new Error("Error al registrar usuario.");
            }
            return prisma_1.default.usuario.create({
                data: {
                    id: data.user.id,
                    nombre: dataDto.nombre,
                    apellido: dataDto.apellido,
                    dni: dataDto.dni,
                    legajo: dataDto.legajo
                }
            });
        });
    }
    validarDatosAlumno(data, alumnos) {
        const cliente = new autogestion_frvm_1.default(String(data.legajo), String(data.contrasena));
        cliente.authenticate().then((student) => {
            console.log(`Iniciada la sesión como ${student.grupo}.`);
        });
        if (!cliente) {
            throw new Error('no exoste');
        }
        return true;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.injectable)()
], AuthService);
