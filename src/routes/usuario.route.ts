import { Router } from "express";
import { container } from "tsyringe";
import { UsuarioService } from "../services/usuario.service";
import { autorizarUsuario } from "../middlewares/rol.middleware";
import { UsuarioController } from "../controllers/usuario.controller";



const router = Router();

const controller = container.resolve(UsuarioController);

router.post("/registrar-vehiculo", async(req, res, next) => {
    await controller.registrarVehiculo(req,res,next);
});



export default router;

