import express, { Express } from "express";
import { getConfirmedOrder,getUnconfirmedOrder,wasPaidOrder,changeStatus } from "../controllers/order.controller";

const route = express.Router();

const orderRoute = (app: Express) => {
    route.get('/confirmedOrder', getConfirmedOrder);
    route.get('/unConfirmedOrder', getUnconfirmedOrder);
    route.post('/wasPaidOrder', wasPaidOrder);
    route.post('/status', changeStatus);

    return app.use('/api/v1/orders', route);
}

export default orderRoute;
