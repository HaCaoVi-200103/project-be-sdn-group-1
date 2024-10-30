import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.id) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' }); // User is not authenticated
};
