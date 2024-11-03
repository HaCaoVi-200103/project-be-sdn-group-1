import express from "express";
import { login, register } from "../controllers/auth.controller"; // Customer authentication
import { registerStaff, loginStaff } from "../controllers/auth.controller"; // Staff authentication
import { isAuthenticated } from "../middleware/sessionMiddleware";

const route = express.Router();

// Customer Registration Route
route.post('/register', register);

// Customer Login Route
route.post('/login', login);

// Staff Registration Route
route.post('/staff/register', registerStaff);

// Staff Login Route
route.post('/staff/login', loginStaff);


// Protected Route
route.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'You have access to this protected route', userId: req.session });
});

// Exporting the route to use in the app
export default route;
