import express, { Express } from "express";
import { login, register } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/sessionMiddleware";
const route = express.Router();

/* GET home page. */

// const authApiRoutes = (app: Express) => {
// Register Route
route.post('/register', register);

// Login Route
route.post('/login', login);

route.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'You have access to this protected route', userId: req.session });
});

// return app.use('/api/v1/auth', route);
// }

export default route;
