import express, { Express } from "express";
import { createStaff, getAllStaff, getStaffById, updateStaff } from "../controllers/staff.controller";
const route = express.Router();

/* GET home page. */

const staffApiRoutes = (app: Express) => {
    route.get('/list-staff', getAllStaff);
    route.get('/:staffId', getStaffById);
    route.post('/', createStaff);
    route.put('/', updateStaff);


    return app.use('/api/v1/staff', route);;
}

export default staffApiRoutes;
