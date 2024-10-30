import express, { Express } from "express";
import {
  addToppings,
  deleteTopping,
  filterToppingsByPrice,
  getTopping,
  getSomeToppings,
  searchToppings,
  updateTopping,
} from "../controllers/toppingManagement.controller";
import multer from "multer";

const route = express.Router();
const upload = multer();

const ToppingManagementRoute = (app: Express) => {
  route.get("/", getSomeToppings);
  route.get("/:id", getTopping);
  route.post("/", upload.single("file"), addToppings);
  route.delete("/:id", deleteTopping);
  route.put("/:id", upload.single("file"), updateTopping);
  route.post("/search", searchToppings);
  route.post("/filter", filterToppingsByPrice);

  return app.use("/api/v1/toppings", route);
};

export default ToppingManagementRoute;
