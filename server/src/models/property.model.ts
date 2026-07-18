import { Schema, model, models, Document } from "mongoose";

export type ListingType = "rent" | "sale";
export type PropertyStatus = "pending" | "approved" | "rejected";

export interface IProperty extends Document {
  title: string;
  type: ListingType;
  category: string;
  price: number;
  rentPrice?: number;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  images: string[];
  owner: Schema.Types.ObjectId;
  status: PropertyStatus;
  featured: boolean;
  createdAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  type: { type: String, enum: ["rent", "sale"], required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rentPrice: { type: Number },
  city: { type: String, required: true },
  address: { type: String, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  area: { type: Number, default: 0 },
  description: { type: String, default: "" },
  images: { type: [String], default: [] },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Property = models.Property || model<IProperty>("Property", propertySchema);
