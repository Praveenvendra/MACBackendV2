import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from  './src/swagger.js';

import router from "./src/routes/router.js";
dotenv.config();

const app = express();


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());


console.log('PORT:', process.env.PORT); 

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use("/", router); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;