import express, { Express } from "express";
import {
  addCakes,
  deleteCake,
  filterCakesByPriceOrType,
  getCake,
  getSomeCakes,
  searchCakes,
  updateCake,
} from "../controllers/cakeManagement.controller";
import multer from "multer";

const route = express.Router();
const upload = multer();

const cakeManagementRoute = (app: Express) => {
  route.get("/", getSomeCakes);
  route.get("/:id", getCake);
  route.post("/", upload.single("file"), addCakes);
  route.delete("/:id", deleteCake);
  route.put("/:id", upload.single("file"), updateCake);
  route.post("/search", searchCakes);
  route.post("/filter", filterCakesByPriceOrType);

  return app.use("/api/v1/cakes", route);
};

export default cakeManagementRoute;
