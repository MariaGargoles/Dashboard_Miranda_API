import { RoomService } from '../services/room';
import { ControllersGeneric } from '../utils/controller';
import Express from "express";
import { 
    createRoomValidation, 
    mongoIdValidation,
    paginationValidation
} from '../middleware/validators';
import { createLimiter } from '../middleware/rateLimiter';

const roomHandler = new RoomService();

const roomRouter = Express.Router();
const { getAll, getId, post, deleteID, update } = ControllersGeneric(roomHandler);

// Rutas con validaciones
roomRouter.get('/', paginationValidation, getAll);
roomRouter.get('/:id', mongoIdValidation, getId);
roomRouter.post('/', createLimiter, createRoomValidation, post);
roomRouter.delete('/:id', mongoIdValidation, deleteID);
roomRouter.post('/:id/update', mongoIdValidation, update);  

export default roomRouter;
