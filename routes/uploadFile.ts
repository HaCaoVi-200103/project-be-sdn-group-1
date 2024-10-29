import express, { Express } from "express";
import multer from "multer";
import { uploadFile } from "../controllers/uploadFile";

const route = express.Router();
const upload = multer();

const uploadFileRoute = (app: Express) => {
    route.post('/', upload.single("file"), uploadFile);

    return app.use('/api/v1/upload', route);
}

export default uploadFileRoute;
