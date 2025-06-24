"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const solicitud_routes_1 = __importDefault(require("./routes/solicitud.routes"));
const usuario_route_1 = __importDefault(require("./routes/usuario.route"));
const viaje_route_1 = __importDefault(require("./routes/viaje.route"));
const swagger_1 = __importDefault(require("./lib/swagger"));
const error_middleware_1 = require("./middlewares/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
//BUscar informacion sobre express.json.
app.use(express_1.default.json());
//Implementacion de swagger.
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
app.use("/api/auth", auth_route_1.default);
app.use("/api/solicitud", solicitud_routes_1.default);
app.use("/api/usuario", usuario_route_1.default);
app.use('/api/viaje', viaje_route_1.default);
app.use(error_middleware_1.captuarErrores);
app.get('/', (req, res) => {
    res.send('Hello World with Express, TypeScript and Prisma!');
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
