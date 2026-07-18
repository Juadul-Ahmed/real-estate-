import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/validate";
import { propertySchema } from "../validators";
import { Property } from "../models/property.model";
import { User } from "../models/user.model";

function populateOwner(query: any) {
  return query.populate("owner", "name email phone avatar brokerApproved");
}

export const listProperties = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, city, category, minPrice, maxPrice, bedrooms, q, status, owner, page, limit } = req.query as Record<string, string>;

  const filter: any = {};
  if (type) filter.type = type;
  if (city) filter.city = new RegExp(city, "i");
  if (category) filter.category = new RegExp(category, "i");
  if (owner) filter.owner = owner;
  if (status) filter.status = status;
  if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (q) filter.$text = { $search: q };

  const pageNum = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(limit) || 9));
  const skip = (pageNum - 1) * pageSize;

  const [properties, total] = await Promise.all([
    populateOwner(Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize)),
    Property.countDocuments(filter),
  ]);

  res.json({ properties, page: pageNum, limit: pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
});

export const getProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const property = await populateOwner(Property.findById(req.params.id));
  if (!property) {
    res.status(404).json({ message: "Property not found" });
    return;
  }
  res.json({ property });
});

export const createProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = propertySchema.parse(req.body);
  const property = await Property.create({ ...data, owner: req.user!.id });
  res.status(201).json({ property });
});

export const updateProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = propertySchema.parse(req.body);
  const isAdmin = req.user?.role === "admin";
  const property = await Property.findOneAndUpdate(
    isAdmin ? { _id: req.params.id } : { _id: req.params.id, owner: req.user!.id },
    data,
    { new: true }
  );
  if (!property) {
    res.status(404).json({ message: "Property not found" });
    return;
  }
  res.json({ property });
});

export const deleteProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user?.role === "admin";
  const property = await Property.findOneAndDelete(isAdmin ? { _id: req.params.id } : { _id: req.params.id, owner: req.user!.id });
  if (!property) {
    res.status(404).json({ message: "Property not found" });
    return;
  }
  res.json({ message: "Deleted" });
});

export const setPropertyStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!property) {
    res.status(404).json({ message: "Property not found" });
    return;
  }
  res.json({ property });
});

export const brokerStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const owner = req.user!.id;
  const [total, pending, approved, inquiries] = await Promise.all([
    Property.countDocuments({ owner }),
    Property.countDocuments({ owner, status: "pending" }),
    Property.countDocuments({ owner, status: "approved" }),
    Inquiry_count(owner),
  ]);
  res.json({ total, pending, approved, inquiries });
});

async function Inquiry_count(owner: string) {
  const props = await Property.find({ owner }, "_id");
  const ids = props.map((p) => p._id);
  const { Inquiry } = await import("../models/inquiry.model");
  return Inquiry.countDocuments({ property: { $in: ids } });
}
