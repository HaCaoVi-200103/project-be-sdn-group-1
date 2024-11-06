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
} from "../controllers/order.controller";
import { verifyStaff } from "../middleware/auth";

const route = express.Router();

const orderRoute = (app: Express) => {
    route.post("/confirmedOrder", verifyStaff, getConfirmedOrder);
    route.post("/unConfirmedOrder", verifyStaff, getUnconfirmedOrder);
    route.put("/wasPaidOrder", verifyStaff, wasPaidOrder);
    route.post("/allOrder", verifyStaff, getAllOrder);
    route.put("/status", verifyStaff, changeStatus);
    route.post("/search", verifyStaff, searchOrder);
    route.post("/filter", verifyStaff, filterOrder);
    route.put("/acceptOrder", verifyStaff, acceptOrder);
    route.get("/getAvailableWeeks", verifyStaff, getAvailableWeeks);
    route.post("/getOrderByWeek", verifyStaff, getOrderByWeek);
    route.get("/:id", verifyStaff, getOrderByID);

    return app.use("/api/v1/orders", route);
};

export default orderRoute;