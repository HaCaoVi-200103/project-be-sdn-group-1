import express, { Express } from "express";
import { getProfileById } from "../controllers/profile.controller";

const route = express.Router();

const profileApiRoutes = (app: Express) => {
    route.get('/customer/:id', getProfileById);


    return app.use('/api/v1/profile', route)
}

export default profileApiRoutes;
