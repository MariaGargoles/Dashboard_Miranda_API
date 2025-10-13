import express, { Request, Response } from 'express';
import { UserModel } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { loginValidation } from '../middleware/validators';
import { loginLimiter } from '../middleware/rateLimiter';
import logger from '../utils/logger';

export const loginController = express.Router();

// Endpoint POST /login
loginController.post('/login', loginLimiter, loginValidation, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario con password incluido (select: false requiere +password)
        const user = await UserModel.findOne({ 
            email: new RegExp(`^${email}$`, 'i') 
        }).select('+password').exec();
        
        if (!user) {
            logger.warn(`Failed login attempt for email: ${email}`);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            logger.warn(`Failed login attempt for user: ${user.email}`);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            logger.error('TOKEN_SECRET is not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const token = jwt.sign(
            { email: user.email, userId: user._id },
            secret,
            { expiresIn: '8h' }
        );

        const userChecked = {
            email: user.email,
            name: user.name,
            photo: user.photo,
            status: user.status
        };

        logger.info(`User ${user.email} logged in successfully`);
        return res.status(200).json({ token, user: userChecked });
    } catch (error) {
        logger.error('Error during login process:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
