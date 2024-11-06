import express, { Express } from "express";
import { createOrderCashPayment, createOrderQRPayment } from "../controllers/payManage.controller";

const route = express.Router();

const orderPaymentRoute = (app: Express) => {
    route.post('/pay-by-cash', createOrderCashPayment);
    route.post('/pay-by-qr', createOrderQRPayment);

    return app.use('/api/v1/payment', route);
}

export default orderPaymentRoute;
