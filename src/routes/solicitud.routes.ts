
import { Router } from "express";
import { container } from "tsyringe";
import { SolicitudViajeController } from "../controllers/solicitud.controller";
import { autorizarUsuario } from "../middlewares/rol.middleware";

const router = Router();
const contollers = container.resolve(SolicitudViajeController);

//Funcionalidades del PASAJERO.
router.post("/registrar-solicitud",autorizarUsuario("PASAJERO"), async (req, res, next) => {
    await contollers.registrarSolicitud(req, res, next);
});


router.get("/listar/:id",autorizarUsuario("PASAJERO"), async (req, res, next) => {
    await  contollers.listarSolicitudes(req, res, next);
});

//FALTA VALIDAR QUE LA SOLICITUD CANCELADA PERTENECE AL PASAJERO.
router.delete("/cancelar/:id", autorizarUsuario("PASAJERO"), async(req, res, next)=> {
    await contollers.cancelarSolicitudDeVaije(req, res, next);
});

//Funcionalidades del CONDUCTOR.
router.get("/solicitudes-pendientes", autorizarUsuario("CONDUCTOR"), async(req, res, next) => {
    await contollers.listaSolicitudesPendientes(req, res, next);
});


export default router;