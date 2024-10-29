import express, { Express } from "express";
import { getAllStaff } from "../controllers/staff.controller";
const route = express.Router();

/* GET home page. */

const staffApiRoutes = (app: Express) => {
    route.get('/list-staff', getAllStaff);


    return app.use('/api/v1/staff', route);;
}

export default staffApiRoutes;
