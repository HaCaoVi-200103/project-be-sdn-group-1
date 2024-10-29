import express, { Express } from "express";
import { createRatingCake, getRatingByCakeId } from "../controllers/rating.controller";
const route = express.Router();

/* GET home page. */

const ratingApiRoutes = (app: Express) => {
    route.get('/:cakeId', getRatingByCakeId);
    route.post('/', createRatingCake);

    return app.use('/api/v1/rating', route);;
}

export default ratingApiRoutes;
