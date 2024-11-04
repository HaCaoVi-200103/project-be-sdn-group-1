import express, { Express } from "express";
import { getAllStores } from "../controllers/store.controller";

const route = express.Router();

const storeRoute = (app: Express) => {
    route.get("/", getAllStores);
    return app.use("/api/v1/stores", route);
};

export default storeRoute;
