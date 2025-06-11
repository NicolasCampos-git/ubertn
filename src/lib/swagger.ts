import swaggerJSDoc from "swagger-jsdoc";
import path from "path";



const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'Api UberTn',
          description: 'Api destianda a la catedra de Investigacion Operativa.',
          version: '1.0.0',
        },
      },
    apis:['./src/routes/*']
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

