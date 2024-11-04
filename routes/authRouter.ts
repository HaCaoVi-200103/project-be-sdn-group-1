import express from "express";
import { login, register, user, loginByGoogle } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/sessionMiddleware"; // Middleware kiểm tra phiên làm việc


const route = express.Router();

// Customer Registration Route
route.post("/register", register);

// Customer Login Route
route.post("/login", login);

// Middleware để giải mã token và lấy thông tin người dùng
route.get('/user', isAuthenticated, user); // Bảo vệ route người dùng bằng isAuthenticated

// Login By Google
route.post("/loginByGoogle", loginByGoogle);




// Exporting the route to use in the app
export default route;
