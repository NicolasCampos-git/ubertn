import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRouter  from "./routes/auth.route";
import solicitudRouter from "./routes/solicitud.routes";
import usuarioRouter from "./routes/usuario.route";
import viajeRouter from "./routes/viaje.route";
import swaggerSpec from './lib/swagger';

import { captuarErrores } from './middlewares/error.middleware';

dotenv.config();
const app = express();
const port = process.env.PORT;
// Habilitar CORS con opciones
app.use(cors({
  origin: 'http://localhost:5000', // dirección del frontend
  credentials: true, // si vas a usar cookies o headers con auth
}));

//BUscar informacion sobre express.json.
app.use(express.json());

//Implementacion de swagger.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/auth", authRouter);


app.use("/api/solicitud", solicitudRouter);

app.use("/api/usuario",usuarioRouter);

app.use('/api/viaje', viajeRouter);

app.use(captuarErrores);

app.get('/', (req, res) => {
  res.send('Hello World with Express, TypeScript and Prisma!');
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




