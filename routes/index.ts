import express, { Express } from "express";
import authRouter from './authRouter'; // Import the authRouter

const route = express.Router();

/* GET home page. */
const initApiRoutes = (app: Express) => {
    route.get('/', (req, res) => {
        res.status(200).end("Project SDN GROUP 1");
    });

    // Add authRouter to route authentication routes
    app.use('/api/v1/auth', authRouter)
    return app;
}

export default initApiRoutes;
