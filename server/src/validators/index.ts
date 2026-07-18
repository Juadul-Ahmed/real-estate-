import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["buyer", "broker"]),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});

export const propertySchema = z.object({
  title: z.string().min(2),
  type: z.enum(["rent", "sale"]),
  category: z.string().min(1),
  price: z.number().positive(),
  rentPrice: z.number().positive().optional(),
  city: z.string().min(1),
  address: z.string().min(1),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  area: z.number().min(0).default(0),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

export const inquirySchema = z.object({
  propertyId: z.string().min(1),
  message: z.string().min(1),
});

export const messageSchema = z.object({
  inquiryId: z.string().min(1),
  text: z.string().min(1),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(["buyer", "broker", "admin"]).optional(),
  brokerApproved: z.boolean().optional(),
  phone: z.string().optional(),
});

export const statusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});
