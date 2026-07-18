"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavorite = exports.updateProfile = exports.me = exports.login = exports.register = void 0;
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const user_model_1 = require("../models/user.model");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
function publicUser(u) {
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
exports.register = (0, validate_1.asyncHandler)(async (req, res) => {
    const data = validators_1.registerSchema.parse(req.body);
    const existing = await user_model_1.User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
        res.status(409).json({ message: "Email already registered" });
        return;
    }
    const passwordHash = await (0, password_1.hashPassword)(data.password);
    const user = await user_model_1.User.create({
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        role: data.role,
        phone: data.phone,
    });
    const token = (0, jwt_1.signToken)({ id: String(user._id), role: user.role });
    res.status(201).json({ token, user: publicUser(user) });
});
exports.login = (0, validate_1.asyncHandler)(async (req, res) => {
    const data = validators_1.loginSchema.parse(req.body);
    const user = await user_model_1.User.findOne({ email: data.email.toLowerCase() });
    if (!user || !(await (0, password_1.comparePassword)(data.password, user.passwordHash))) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    if (user.role === "broker" && !user.brokerApproved) {
        res.status(403).json({ message: "Your broker account is pending admin approval" });
        return;
    }
    const token = (0, jwt_1.signToken)({ id: String(user._id), role: user.role });
    res.json({ token, user: publicUser(user) });
});
exports.me = (0, validate_1.asyncHandler)(async (req, res) => {
    const user = await user_model_1.User.findById(req.user.id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ user: publicUser(user) });
});
exports.updateProfile = (0, validate_1.asyncHandler)(async (req, res) => {
    const data = validators_1.updateProfileSchema.parse(req.body);
    const user = await user_model_1.User.findByIdAndUpdate(req.user.id, data, { new: true });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ user: publicUser(user) });
});
exports.toggleFavorite = (0, validate_1.asyncHandler)(async (req, res) => {
    const propertyId = req.params.id;
    const user = await user_model_1.User.findById(req.user.id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const idx = user.favorites.findIndex((f) => f.toString() === propertyId);
    if (idx >= 0)
        user.favorites.splice(idx, 1);
    else
        user.favorites.push(propertyId);
    await user.save();
    res.json({ favorites: user.favorites });
});
//# sourceMappingURL=auth.controller.js.map