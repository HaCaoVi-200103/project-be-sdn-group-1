import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
    userId: string; // Type for userId
    role: string; // Add the role property for role verification
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).send("You are not authenticated!");
        }
        const token = auth.split(" ")[1];

        if (!process.env.JWT_KEY) {
            console.error("JWT_KEY not exist in .env");
            return res.status(500).send("Internal server error");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY) as CustomJwtPayload;
        req.body.userId = payload.userId; // Store userId in request for later use
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).send("Token is not valid");
    }
};

const verifyRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const auth = req.headers.authorization;
            // console.log(req.headers);

            if (!auth) {
                return res.status(401).send("You are not authenticated!");
            }
            const token = auth.split(" ")[1];

            if (!process.env.JWT_KEY) {
                console.error("JWT_KEY not exist in .env");
                return res.status(500).send("Internal server error");
            }

            const payload = jwt.verify(token, process.env.JWT_KEY) as CustomJwtPayload;
            console.log(payload.role);

            if (payload.role !== role) {
                return res.status(403).send(`Access denied. You are not a ${role}.`);
            }

            req.body.userId = payload.userId; // Store userId in request for later use
            next();
        } catch (error) {
            console.error(error);
            return res.status(403).send("Token is not valid");
        }
    };
};

const verifyCustomer = verifyRole('customer');
const verifyStaff = verifyRole('staff');
const verifyAdmin = verifyRole('manager');

export { verifyToken, verifyCustomer, verifyStaff, verifyAdmin };
