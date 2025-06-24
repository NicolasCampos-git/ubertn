import { Router } from "express";
import { container } from "tsyringe";
import { ViajeService } from "../services/viaje.service";
import { ViajeController } from "../controllers/viaje.controller";
import { autorizarUsuario } from "../middlewares/rol.middleware";





const router = Router();

const controller = container.resolve(ViajeController);


router.post("/registrar-viaje",autorizarUsuario("CONDUCTOR"), async(req, res, next) => {
    
    await controller.registrarViaje(req,res,next);
});

router.delete("/cancelar-viaje",autorizarUsuario("CONDUCTOR"), async(req, res, next)=> {

    await controller.cancelarViaje(req, res, next);
});

router.post("/iniciar-viaje", async(req, res, next)=> {
    await controller.iniciarViaje(req, res, next)
})

router.get("/listar-viajes-pendientes", async(req, res, next)=> {
    
    await controller.listaViajesPendientes(req,res, next);
});




export default router