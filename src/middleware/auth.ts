import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { ErrorApi } from "../utils/error";

export function authTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.header('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided or invalid format' });
        return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        res.status(401).json({ error: 'Token not found' });
        return;
    }

    try {
        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            throw new ErrorApi('TOKEN_SECRET not configured', 500, false);
        }
        
        const decoded = jwt.verify(token, secret);
        (req as any).user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(new ErrorApi('Token expired', 401, true));
        } else if (error instanceof jwt.JsonWebTokenError) {
            next(new ErrorApi('Invalid token', 401, true));
        } else {
            next(error);
        }
    }
}