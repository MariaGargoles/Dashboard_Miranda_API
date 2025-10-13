import { Router } from 'express';
import { ContactMessagesService } from '../services/contactmessages';
import { ControllersGeneric } from '../utils/controller';
import { 
    createContactMessageValidation, 
    mongoIdValidation,
    paginationValidation
} from '../middleware/validators';
import { createLimiter } from '../middleware/rateLimiter';

const contactRouter = Router();
const contactMessagesService = new ContactMessagesService();  
const { getAll, getId, post, deleteID, update } = ControllersGeneric(contactMessagesService);

// Rutas con validaciones
contactRouter.get('/', paginationValidation, getAll);  
contactRouter.get('/:id', mongoIdValidation, getId);  
contactRouter.post('/', createLimiter, createContactMessageValidation, post);  
contactRouter.delete('/:id', mongoIdValidation, deleteID);  
contactRouter.patch('/:id', mongoIdValidation, update);  

export default contactRouter;
