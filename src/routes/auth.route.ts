import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";


const router = Router();
const controllers = container.resolve(AuthController);

/**
 * @swagger
 * components: 
 *    securitySchemes:
 *      apiAuth: 
 *        type: apiKey
 *        in: header
 *        name: token
 */

router.post("/registrarse", async (req, res, next) => {
  await controllers.registrarUsuario(req,res, next);

});


router.post("/login", async (req, res, next) => {
  const token = await controllers.login(req, res);
});

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


export default router;