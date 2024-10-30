import express, { Express } from "express";
import { createStaff, getAllStaff, getStaffById, updateStaff } from "../controllers/staff.controller";
import multer from "multer";
const route = express.Router();
const upload = multer();

const staffApiRoutes = (app: Express) => {
    route.get('/list-staff', getAllStaff);
    route.get('/:staffId', getStaffById);
    route.post('/', createStaff);
    route.put('/:staffId', upload.single("file"), updateStaff);

    return app.use('/api/v1/staff', route);;
}

export default staffApiRoutes;
