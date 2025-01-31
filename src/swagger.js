import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Swagger specification version
    info: {
      title: "MAC Backend", // Title for your documentation
      version: "1.0.0", // API version
      description: "API documentation for Mac application", // Description of your API
    //   contact: {
    //     name: "Your Name",
    //     email: "your-email@example.com",
    //   },
    },
    servers: [
      {
        url: "http://localhost:3001", // Replace with your development server base URL
        description: "Development Server",
      },
    ],
  },
  apis: ["./src/routes/router.js"], // Points to route files for adding JSDoc-style comments
};

 export const swaggerSpec = swaggerJsDoc(swaggerOptions);

