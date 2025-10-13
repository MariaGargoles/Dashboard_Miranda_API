import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Middleware para manejar errores de validación
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Validation failed', 
            details: errors.array() 
        });
    }
    next();
};

// Validaciones para autenticación
export const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

// Validaciones para usuarios
export const createUserValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('photo')
        .notEmpty()
        .withMessage('Photo URL is required')
        .isURL()
        .withMessage('Photo must be a valid URL'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .trim(),
    body('contact')
        .notEmpty()
        .withMessage('Contact is required'),
    body('status')
        .isIn(['ACTIVE', 'INACTIVE'])
        .withMessage('Status must be either ACTIVE or INACTIVE'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    handleValidationErrors
];

export const updateUserValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('photo')
        .optional()
        .isURL()
        .withMessage('Photo must be a valid URL'),
    body('status')
        .optional()
        .isIn(['ACTIVE', 'INACTIVE'])
        .withMessage('Status must be either ACTIVE or INACTIVE'),
    handleValidationErrors
];

// Validaciones para habitaciones
export const createRoomValidation = [
    body('name')
        .notEmpty()
        .withMessage('Room name is required')
        .trim(),
    body('number')
        .notEmpty()
        .withMessage('Room number is required'),
    body('bedType')
        .isIn(['Single', 'Double', 'Queen', 'King'])
        .withMessage('Invalid bed type'),
    body('rate')
        .isFloat({ min: 0 })
        .withMessage('Rate must be a positive number'),
    body('status')
        .isIn(['Available', 'Booked'])
        .withMessage('Status must be either Available or Booked'),
    handleValidationErrors
];

// Validaciones para reservas
export const createBookingValidation = [
    body('Name')
        .notEmpty()
        .withMessage('Guest name is required')
        .trim(),
    body('CheckIn')
        .isISO8601()
        .withMessage('Check-in date must be a valid date')
        .custom((value) => {
            const checkIn = new Date(value);
            if (checkIn < new Date()) {
                throw new Error('Check-in date must be in the future');
            }
            return true;
        }),
    body('CheckOut')
        .isISO8601()
        .withMessage('Check-out date must be a valid date')
        .custom((value, { req }) => {
            const checkOut = new Date(value);
            const checkIn = new Date(req.body.CheckIn);
            if (checkOut <= checkIn) {
                throw new Error('Check-out date must be after check-in date');
            }
            return true;
        }),
    body('roomId')
        .isMongoId()
        .withMessage('Invalid room ID'),
    body('Status')
        .optional()
        .isIn(['In Progress', 'Check In', 'Check Out'])
        .withMessage('Invalid status'),
    handleValidationErrors
];

// Validaciones para mensajes de contacto
export const createContactMessageValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('subject')
        .notEmpty()
        .withMessage('Subject is required')
        .trim()
        .isLength({ max: 200 })
        .withMessage('Subject must not exceed 200 characters'),
    body('comment')
        .notEmpty()
        .withMessage('Comment is required')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Comment must be between 10 and 1000 characters'),
    handleValidationErrors
];

// Validación de ID de MongoDB
export const mongoIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
    handleValidationErrors
];

// Validación de paginación
export const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

