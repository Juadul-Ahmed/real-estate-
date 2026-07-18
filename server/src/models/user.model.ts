import { Schema, model, models, Document } from "mongoose";
import { Role } from "../types";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  phone?: string;
  avatar?: string;
  bio?: string;
  brokerApproved: boolean;
  favorites: Schema.Types.ObjectId[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["buyer", "broker", "admin"], default: "buyer" },
  phone: { type: String },
  avatar: { type: String },
  bio: { type: String },
  brokerApproved: { type: Boolean, default: false },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model<IUser>("User", userSchema);
