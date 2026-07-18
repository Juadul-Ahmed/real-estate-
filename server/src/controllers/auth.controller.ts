import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/validate";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators";
import { User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

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
    favorites: u.favorites,
    createdAt: u.createdAt,
  };
}

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = registerSchema.parse(req.body);
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }
  const passwordHash = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash,
    role: data.role,
    phone: data.phone,
  });
  const token = signToken({ id: String(user._id), role: user.role });
  res.status(201).json({ token, user: publicUser(user) });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = loginSchema.parse(req.body);
  const user = await User.findOne({ email: data.email.toLowerCase() });
  if (!user || !(await comparePassword(data.password, user.passwordHash))) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  if (user.role === "broker" && !user.brokerApproved) {
    res.status(403).json({ message: "Your broker account is pending admin approval" });
    return;
  }
  const token = signToken({ id: String(user._id), role: user.role });
  res.json({ token, user: publicUser(user) });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ user: publicUser(user) });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = updateProfileSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.user!.id, data, { new: true });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json({ user: publicUser(user) });
});

export const toggleFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const propertyId = req.params.id;
  const user = await User.findById(req.user!.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const idx = user.favorites.findIndex((f: any) => f.toString() === propertyId);
  if (idx >= 0) user.favorites.splice(idx, 1);
  else user.favorites.push(propertyId as any);
  await user.save();
  res.json({ favorites: user.favorites });
});
