import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller";


const router = Router();
const controllers = container.resolve(AuthController);



router.post("/registrarse", async (req, res, next) => {
  await controllers.registrarUsuario(req,res, next);

});


router.post("/login", async (req, res, next) => {
  const token = await controllers.login(req, res, next);
  
});




export default router;