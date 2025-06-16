import { inject, injectable } from "tsyringe";
import { AuthService } from "../services/auth.service";
import { RegistrarUsuarioDto } from "../dtos/registrar-usuario.dto";
import { NextFunction, Request, Response } from "express";
import { LoginDto } from "../dtos/login.dto";


@injectable()
export class AuthController {
    constructor(
        @inject(AuthService) private readonly authService: AuthService
    ){} 
    async registrarUsuario(req: Request, res: Response, next: NextFunction){
        try {
            
            const dataDto = req.body as RegistrarUsuarioDto;

            const nuevoUsuario = await this.authService.registrar(dataDto);
           
            return res.status(201).json({
                success: true,
                data: nuevoUsuario,
                message: "Registro de usuario exitoso."
            });

        } catch (error) {

            next(error);
            
        }
    }

    async login(req: Request, res: Response, next: NextFunction){
        try{
            const data: LoginDto = req.body as LoginDto;
            const token = await this.authService.login(data);
            
           return res.status(200).json({
                success: true,
                token: token,
                message: "Login Exitoso."

            });
        }catch(error){
            next(error);
            
        }
    }
}