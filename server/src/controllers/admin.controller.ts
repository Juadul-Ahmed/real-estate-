import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/validate";
import { userUpdateSchema, statusSchema } from "../validators";
import { User } from "../models/user.model";
import { Property } from "../models/property.model";
import { Inquiry } from "../models/inquiry.model";

function publicUser(u: any) {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    avatar: u.avatar,
    bio: u.bio,
    brokerApproved: u.brokerApproved,
    createdAt: u.createdAt,
  };
}

export const listUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users: users.map(publicUser) });
});

export const getUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ user: publicUser(user) });
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = userUpdateSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ user: publicUser(user) });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (user.role === "admin") {
    res.status(400).json({ message: "Cannot delete admin users" });
    return;
  }
  await User.findByIdAndDelete(req.params.id);
  await Property.deleteMany({ owner: req.params.id });
  res.json({ message: "User deleted" });
});

export const listPendingProperties = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const properties = await Property.find({ status: "pending" })
    .populate("owner", "name email phone")
    .sort({ createdAt: -1 });
  res.json({ properties });
});

export const setPropertyStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = statusSchema.parse(req.body);
  const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!property) {
    res.status(404).json({ message: "Property not found" });
    return;
  }
  res.json({ property });
});

export const adminDeleteProperty = asyncHandler(async (req: AuthRequest, res: Response) => {
  const property = await Property.findByIdAndDelete(req.params.id);
  if (!property) {
    res.status(404).json({ message: "Property not found" });
    return;
  }
  res.json({ message: "Property deleted" });
});

export const analytics = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [users, buyers, brokers, admins, properties, approved, pending, rejected, inquiries, messages] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "buyer" }),
      User.countDocuments({ role: "broker" }),
      User.countDocuments({ role: "admin" }),
      Property.countDocuments(),
      Property.countDocuments({ status: "approved" }),
      Property.countDocuments({ status: "pending" }),
      Property.countDocuments({ status: "rejected" }),
      Inquiry.countDocuments(),
      (await import("../models/message.model")).Message.countDocuments(),
    ]);

  const days = 7;
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  const [userTrend, propertyTrend, inquiryTrend] = await Promise.all([
    User.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Property.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Inquiry.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const labels: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toISOString().slice(5, 10));
  }

  const map = (arr: any[]) => {
    const m = new Map(arr.map((x: any) => [x._id, x.count]));
    return labels.map((l) => ({ date: l, count: m.get(l) || 0 }));
  };

  res.json({
    users,
    buyers,
    brokers,
    admins,
    properties,
    approved,
    pending,
    rejected,
    inquiries,
    messages,
    trends: {
      labels,
      users: map(userTrend),
      properties: map(propertyTrend),
      inquiries: map(inquiryTrend),
    },
  });
});
