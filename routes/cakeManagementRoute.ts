import express, { Express } from "express";
import {
  addCakes,
  deleteCake,
  getAllCakes,
} from "../controllers/cakeManagement.controller";
import multer from "multer";

const route = express.Router();
const upload = multer();

const cakeManagementRoute = (app: Express) => {
  route.get("/", getAllCakes);
  route.post("/", upload.single("file"), addCakes);
  route.delete("/:id", deleteCake);
  return app.use("/api/v1/cakes", route);
};

export default cakeManagementRoute;
