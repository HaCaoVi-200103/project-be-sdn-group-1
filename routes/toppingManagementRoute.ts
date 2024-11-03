import express, { Express } from "express";
import {
  addToppings,
  deleteTopping,
  getTopping,
  getSomeToppings,
  updateTopping,
  searchAndFilterToppings,
} from "../controllers/toppingManagement.controller";
import multer from "multer";

const route = express.Router();
const upload = multer();

const ToppingManagementRoute = (app: Express) => {
  route.post("/pagination", getSomeToppings);
  route.get("/:id", getTopping);
  route.post("/", upload.single("file"), addToppings);
  route.delete("/:id", deleteTopping);
  route.put("/:id", upload.single("file"), updateTopping);
  route.post("/search", searchAndFilterToppings);

  return app.use("/api/v1/toppings", route);
};

export default ToppingManagementRoute;
