import { UserService } from '../services/users';
import { ControllersGeneric } from '../utils/controller';
import Express from "express";
import { 
    createUserValidation, 
    updateUserValidation, 
    mongoIdValidation,
    paginationValidation
} from '../middleware/validators';
import { createLimiter } from '../middleware/rateLimiter';

const UserHandler = new UserService();

const userRouter = Express.Router();
const { getAll, getId, post, deleteID, update } = ControllersGeneric(UserHandler);

// Rutas con validaciones
userRouter.get('/', paginationValidation, getAll);
userRouter.get('/:id', mongoIdValidation, getId);
userRouter.post('/', createLimiter, createUserValidation, post);
userRouter.delete('/:id', mongoIdValidation, deleteID);
userRouter.patch('/:id', updateUserValidation, update);

export default userRouter;
