import express, { Express } from "express";
import { addToCart, editCart } from "../controllers/cartManagement.controller";

const route = express.Router();

const cartManagementRoute = (app: Express) => {
  route.post("/add-to-cart", addToCart);
  route.put("/edit-cart", editCart);
  return app.use("/api/v1/cart", route);
};

export default cartManagementRoute;
