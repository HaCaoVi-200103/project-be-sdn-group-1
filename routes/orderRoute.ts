import express, { Express } from "express";
import {
    getConfirmedOrder,
    getUnconfirmedOrder,
    wasPaidOrder,
    changeStatus,
    getAllOrder,
    searchOrder,
    filterOrder,
    acceptOrder,
    getOrderByID,
    getAvailableWeeks,
    getOrderByWeek,
    createOrder,
    getTopping,
} from "../controllers/order.controller";

const route = express.Router();

const orderRoute = (app: Express) => {

    route.get("/get-list", getTopping)
    route.post("/create-order", createOrder)


    route.post("/confirmedOrder", getConfirmedOrder);
    route.post("/unConfirmedOrder", getUnconfirmedOrder);
    route.put("/wasPaidOrder", wasPaidOrder);
    route.post("/allOrder", getAllOrder);
    route.put("/status", changeStatus);
    route.post("/search", searchOrder);
    route.post("/filter", filterOrder);
    route.put("/acceptOrder", acceptOrder);
    route.get("/getAvailableWeeks", getAvailableWeeks);
    route.post("/getOrderByWeek", getOrderByWeek);
    route.get("/:id", getOrderByID);

    return app.use("/api/v1/orders", route);
};

export default orderRoute;