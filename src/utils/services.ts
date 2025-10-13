import { Model, Document } from 'mongoose';

export interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export class ServicesGeneric<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async getAll(options?: PaginationOptions): Promise<T[] | PaginatedResult<T>> {
        // Si no hay opciones de paginación, devolver todos
        if (!options || (!options.page && !options.limit)) {
            return this.model.find().exec();
        }

        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;

        const [data, totalItems] = await Promise.all([
            this.model.find().skip(skip).limit(limit).exec(),
            this.model.countDocuments().exec()
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }

    async getId(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    async add(item: Partial<T>): Promise<T> {
        return this.model.create(item as T);
    }

    async deleteID(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }

    async update(id: string, updates: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, updates, { new: true }).exec();
    }
}
