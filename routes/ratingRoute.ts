import express, { Express } from "express";
import { createRatingCake } from "../controllers/RattingController";
const route = express.Router();

/* GET home page. */

const ratingApiRoutes = (app: Express) => {
    route.post('/', createRatingCake);

    return app.use('/api/v1/rating', route);;
}

export default ratingApiRoutes;
