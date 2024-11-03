import express, { Express } from "express";
import {
  addCakes,
  deleteCake,
  getCake,
  getCakeTypes,
  getMonthlySales,
  getSomeCakes,
  searchAndFilterCakes,
  updateCake,
} from "../controllers/cakeManagement.controller";
import multer from "multer";

const route = express.Router();
const upload = multer();

const cakeManagementRoute = (app: Express) => {
  route.post("/pagination", getSomeCakes);
  route.get("/:id", getCake);
  route.post("/", upload.single("file"), addCakes);
  route.delete("/:id", deleteCake);
  route.put("/:id", upload.single("file"), updateCake);
  route.post("/search", searchAndFilterCakes);
  route.post("/types", getCakeTypes);
  route.post("/statistic", getMonthlySales);
  // route.post("/revenue", getRevenueByCake);

  return app.use("/api/v1/cakes", route);
};

export default cakeManagementRoute;
