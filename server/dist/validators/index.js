"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusSchema = exports.userUpdateSchema = exports.messageSchema = exports.inquirySchema = exports.propertySchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    role: zod_1.z.enum(["buyer", "broker"]),
    phone: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
});
exports.propertySchema = zod_1.z.object({
    title: zod_1.z.string().min(2),
    type: zod_1.z.enum(["rent", "sale"]),
    category: zod_1.z.string().min(1),
    price: zod_1.z.number().positive(),
    rentPrice: zod_1.z.number().positive().optional(),
    city: zod_1.z.string().min(1),
    address: zod_1.z.string().min(1),
    bedrooms: zod_1.z.number().min(0).default(0),
    bathrooms: zod_1.z.number().min(0).default(0),
    area: zod_1.z.number().min(0).default(0),
    description: zod_1.z.string().optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    featured: zod_1.z.boolean().optional(),
});
exports.inquirySchema = zod_1.z.object({
    propertyId: zod_1.z.string().min(1),
    message: zod_1.z.string().min(1),
});
exports.messageSchema = zod_1.z.object({
    inquiryId: zod_1.z.string().min(1),
    text: zod_1.z.string().min(1),
});
exports.userUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    role: zod_1.z.enum(["buyer", "broker", "admin"]).optional(),
    brokerApproved: zod_1.z.boolean().optional(),
    phone: zod_1.z.string().optional(),
});
exports.statusSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending", "approved", "rejected"]),
});
//# sourceMappingURL=index.js.map