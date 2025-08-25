const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Okta User & Device API",
      version: "1.0.0",
      description: "API to fetch users and their registered devices from Okta",
    },
    servers: [
      {
        url: "https://okta-t5dr.onrender.com", // <-- replace with your Render URL
      },
    ],
  },
  apis: ["./routes/*.js"], // path to your route files with annotations
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
