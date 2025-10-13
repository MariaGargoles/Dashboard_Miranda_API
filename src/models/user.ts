import mongoose, { Schema } from "mongoose";
import { User } from "../interfaces/user";

const UserSchema = new Schema<User>({
    name: { type: String, required: true },
    photo: { type: String, required: true },
    startDate: { type: Date, required: true },
    description: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    contact: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], required: true },
    password: { type: String, required: true, select: false }
}, {
    timestamps: true
});

// Índice para búsquedas por email
UserSchema.index({ email: 1 });

export const UserModel = mongoose.model<User>('User', UserSchema, 'user');

export { User };
