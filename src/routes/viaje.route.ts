import { Router } from "express";
import { container } from "tsyringe";
import { ViajeService } from "../services/viaje.service";
import { ViajeController } from "../controllers/viaje.controller";





const router = Router();

const controller = container.resolve(ViajeController);

router.post("/registrar-viaje", async(req, res, next) => {
    
    await controller.registrarViaje(req,res,next);
});


export default router