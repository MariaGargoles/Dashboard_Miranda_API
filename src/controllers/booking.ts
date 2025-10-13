import { Router } from 'express';
import { BookingService } from '../services/booking';
import { ControllersGeneric } from '../utils/controller';
import { 
    createBookingValidation, 
    mongoIdValidation,
    paginationValidation
} from '../middleware/validators';
import { createLimiter } from '../middleware/rateLimiter';

const bookingRouter = Router();
const bookingService = new BookingService();  
const { getAll, getId, post, deleteID, update } = ControllersGeneric(bookingService); 

// Rutas con validaciones
bookingRouter.get('/', paginationValidation, getAll);
bookingRouter.get('/:id', mongoIdValidation, getId);
bookingRouter.post('/', createLimiter, createBookingValidation, post);
bookingRouter.delete('/:id', mongoIdValidation, deleteID);
bookingRouter.patch('/:id', mongoIdValidation, update);

export default bookingRouter;
