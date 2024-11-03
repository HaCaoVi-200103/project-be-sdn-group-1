import express, { Express } from "express";
import { createRatingCake, deleteRatingById, getRatingByCakeId, getRatingById, updateRatingCake } from "../controllers/rating.controller";
const route = express.Router();

const ratingApiRoutes = (app: Express) => {
    route.get('/:ratingId', getRatingById);
    route.get('/list-rating/:cakeId', getRatingByCakeId);
    route.post('/', createRatingCake);
    route.put('/:ratingId', updateRatingCake);
    route.delete('/:ratingId', deleteRatingById);

    return app.use('/api/v1/rating', route);;
}

export default ratingApiRoutes;