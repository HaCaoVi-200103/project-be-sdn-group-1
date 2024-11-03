import express, { Express } from "express";
import { changePassword, getProfileById, postSendEmail, updateProfileCustomer, updateProfileStaff, verifyPassword } from "../controllers/profile.controller";
import multer from "multer";

const route = express.Router();
const upload = multer();
const profileApiRoutes = (app: Express) => {
    route.get('/customer/:id', getProfileById);
    route.put("/update-customer/:id", upload.single("file"), updateProfileCustomer)
    route.post("/send-code", postSendEmail);
    route.post("/change-password", changePassword);
    route.post("/check-password", verifyPassword)
    route.put("/update-staff/:id", upload.single("file"), updateProfileStaff)

    return app.use('/api/v1/profile', route)
}

export default profileApiRoutes;
