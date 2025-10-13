import express, { Application, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import mustacheExpress from 'mustache-express';
import { loginController } from './controllers/auth';
import roomRouter from './controllers/rooms';  
import userRouter from './controllers/users';
import bookingRouter from './controllers/booking';
import contactRouter  from './controllers/contactmessages'; 
import { connectDB } from './mongodb';
import { ErrorApi } from './utils/error';
import { authTokenMiddleware } from './middleware/auth';
import { generalLimiter } from './middleware/rateLimiter';
import logger from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3002;  

async function startServer() {
    try {
        await connectDB();
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

startServer();

// Seguridad: Helmet para headers HTTP seguros
app.use(helmet({
    contentSecurityPolicy: false, // Desactivar para desarrollo, activar en producción
    crossOriginEmbedderPolicy: false
}));

// Rate limiting general
app.use(generalLimiter);


// CORS Configuration
const allowedOrigins = process.env.DOMAIN_FRONT?.split(',') || ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir requests sin origin (como mobile apps o curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files y view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

// Middleware de logging
app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Routes
app.post('/login', loginController);
app.use('/rooms', authTokenMiddleware, roomRouter);
app.use('/users', authTokenMiddleware, userRouter);
app.use('/booking', authTokenMiddleware, bookingRouter);
app.use('/contact', authTokenMiddleware, contactRouter);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        message: 'Miranda Hotel API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            login: '/login',
            rooms: '/rooms',
            users: '/users',
            booking: '/booking',
            contact: '/contact'
        }
    });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ 
        error: 'Route not found',
        message: 'The requested endpoint does not exist'
    });
});

// Error Handler
app.use((error: ErrorApi, req: Request, res: Response, _next: NextFunction) => {
    // Log del error
    logger.error(`Error in ${req.method} ${req.path}:`, {
        error: error.message,
        stack: error.stack,
        status: error.status
    });

    // Respuesta al cliente
    res.status(error.status || 500).json({
        error: error.safe ? error.message : 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Solo iniciar servidor si no estamos en Lambda
if (process.env.NODE_ENV !== 'production' || !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    app.listen(port, () => {
        logger.info(`Server listening on http://localhost:${port}`);
    });
}

export { app };
