import express, { Express } from "express";
import { getAllCakeHistory,getAllToppingHistory } from "../controllers/productHistoryController";
const route = express.Router();

const productHistoryRoutes = (app: Express) => {
  route.post("/getAllCakeHistory", getAllCakeHistory);
  route.post("/getAllToppingHistory", getAllToppingHistory);

  return app.use("/api/v1/productHistory", route);
};

export default productHistoryRoutes;
