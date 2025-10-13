import { NextFunction, Request, Response } from "express";
import { ServicesGeneric, PaginationOptions } from "./services"; 
import { Document } from "mongoose";
import logger from "./logger";

export const ControllersGeneric = <T extends Document>(Model: ServicesGeneric<T>) => {
    const getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Obtener parámetros de paginación de query string
            const page = req.query.page ? parseInt(req.query.page as string) : undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            const sort = req.query.sort as string | undefined;

            const options: PaginationOptions | undefined = 
                (page || limit) ? { page, limit, sort } : undefined;

            const result = await Model.getAll(options);
            
            res.json(result);
        } catch (error) {
            logger.error('Error in getAll controller:', error);
            next(error);
        }
    };

    const getId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const data = await Model.getId(id);
            
            if (data) {
                res.json({ data });
            } else {
                res.status(404).json({ error: "Resource not found" });
            }
        } catch (error) {
            logger.error(`Error in getId controller for ID ${req.params.id}:`, error);
            next(error);
        }
    };

    const post = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newItem = req.body;
            const created = await Model.add(newItem); 
            
            logger.info(`New resource created with ID: ${(created as any)._id}`);
            res.status(201).json({ data: created });
        } catch (error) {
            logger.error('Error in post controller:', error);
            next(error);
        }
    };

    const deleteID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const deleted = await Model.deleteID(id);
            
            if (deleted) {
                logger.info(`Resource deleted with ID: ${id}`);
                res.json({ data: deleted, message: "Resource deleted successfully" });
            } else {
                res.status(404).json({ error: "Resource not found" });
            }
        } catch (error) {
            logger.error(`Error in deleteID controller for ID ${req.params.id}:`, error);
            next(error);
        }
    };

    const update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const updates = req.body;
            const updated = await Model.update(id, updates); 
            
            if (updated) {
                logger.info(`Resource updated with ID: ${id}`);
                res.json({ data: updated });
            } else {
                res.status(404).json({ error: "Resource not found" });
            }
        } catch (error) {
            logger.error(`Error in update controller for ID ${req.params.id}:`, error);
            next(error);
        }
    };

    return {
        getAll,
        getId,
        post,
        deleteID,
        update  
    };
};
