import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';



import authRouter  from "./routes/auth.route";
import solicitudRouter from "./routes/solicitud.routes";
import swaggerSpec from './lib/swagger';

dotenv.config();
const app = express();
const port = process.env.PORT;

//BUscar informacion sobre express.json.
app.use(express.json());

//Implementacion de swagger.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/auth", authRouter);
app.use("/api/solicitud", solicitudRouter);



app.get('/', (req, res) => {
  res.send('Hello World with Express, TypeScript and Prisma!');
});




app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


