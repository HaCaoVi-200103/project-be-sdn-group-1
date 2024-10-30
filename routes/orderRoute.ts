import express, { Express } from "express";
import { getConfirmedOrder,getUnconfirmedOrder,wasPaidOrder,changeStatus,getAllOrder,searchOrder,filterOrder,acceptOrder } from "../controllers/order.controller";

const route = express.Router();

const orderRoute = (app: Express) => {
    route.get('/confirmedOrder', getConfirmedOrder);
    route.get('/unConfirmedOrder', getUnconfirmedOrder);
    route.post('/wasPaidOrder', wasPaidOrder);
    route.get('/allOrder', getAllOrder);
    route.post('/status', changeStatus);
    route.get('/search', searchOrder);
    route.get('/filter', filterOrder);
    route.post('/acceptOrder', acceptOrder);

    return app.use('/api/v1/orders', route);
}

export default orderRoute;
