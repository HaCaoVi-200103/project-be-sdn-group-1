import express, { Express } from "express";
import { createStaff, getAllStaff, getStaffById } from "../controllers/staff.controller";
const route = express.Router();

/* GET home page. */

const staffApiRoutes = (app: Express) => {
    route.get('/list-staff', getAllStaff);
    route.get('/:staffId', getStaffById);
    route.post('/', createStaff);


    return app.use('/api/v1/staff', route);;
}

export default staffApiRoutes;
