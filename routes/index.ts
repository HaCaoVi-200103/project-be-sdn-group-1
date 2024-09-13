import express, { Express } from "express";
const route = express.Router();

/* GET home page. */

const initApiRoutes = (app: Express) => {
    route.get('/', (req, res) => {
        res.status(200);
        res.end("Project SDN GROUP 1")
    });

    return app.use('/api/v1', route);;
}

export default initApiRoutes;
