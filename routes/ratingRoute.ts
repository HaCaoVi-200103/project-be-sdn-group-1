import express, { Express } from "express";
const route = express.Router();

/* GET home page. */

const ratingApiRoutes = (app: Express) => {
    route.post('/',);

    return app.use('/api/v1/rating', route);;
}

export default ratingApiRoutes;
