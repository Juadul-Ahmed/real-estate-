"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.analytics = exports.adminDeleteProperty = exports.setPropertyStatus = exports.listPendingProperties = exports.deleteUser = exports.updateUser = exports.getUser = exports.listUsers = void 0;
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const user_model_1 = require("../models/user.model");
const property_model_1 = require("../models/property.model");
const inquiry_model_1 = require("../models/inquiry.model");
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
        createdAt: u.createdAt,
    };
}
exports.listUsers = (0, validate_1.asyncHandler)(async (_req, res) => {
    const users = await user_model_1.User.find().sort({ createdAt: -1 });
    res.json({ users: users.map(publicUser) });
});
exports.getUser = (0, validate_1.asyncHandler)(async (req, res) => {
    const user = await user_model_1.User.findById(req.params.id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ user: publicUser(user) });
});
exports.updateUser = (0, validate_1.asyncHandler)(async (req, res) => {
    const data = validators_1.userUpdateSchema.parse(req.body);
    const user = await user_model_1.User.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json({ user: publicUser(user) });
});
exports.deleteUser = (0, validate_1.asyncHandler)(async (req, res) => {
    const user = await user_model_1.User.findById(req.params.id);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (user.role === "admin") {
        res.status(400).json({ message: "Cannot delete admin users" });
        return;
    }
    await user_model_1.User.findByIdAndDelete(req.params.id);
    await property_model_1.Property.deleteMany({ owner: req.params.id });
    res.json({ message: "User deleted" });
});
exports.listPendingProperties = (0, validate_1.asyncHandler)(async (_req, res) => {
    const properties = await property_model_1.Property.find({ status: "pending" })
        .populate("owner", "name email phone")
        .sort({ createdAt: -1 });
    res.json({ properties });
});
exports.setPropertyStatus = (0, validate_1.asyncHandler)(async (req, res) => {
    const { status } = validators_1.statusSchema.parse(req.body);
    const property = await property_model_1.Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
    }
    res.json({ property });
});
exports.adminDeleteProperty = (0, validate_1.asyncHandler)(async (req, res) => {
    const property = await property_model_1.Property.findByIdAndDelete(req.params.id);
    if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
    }
    res.json({ message: "Property deleted" });
});
exports.analytics = (0, validate_1.asyncHandler)(async (_req, res) => {
    const [users, buyers, brokers, admins, properties, approved, pending, rejected, inquiries, messages] = await Promise.all([
        user_model_1.User.countDocuments(),
        user_model_1.User.countDocuments({ role: "buyer" }),
        user_model_1.User.countDocuments({ role: "broker" }),
        user_model_1.User.countDocuments({ role: "admin" }),
        property_model_1.Property.countDocuments(),
        property_model_1.Property.countDocuments({ status: "approved" }),
        property_model_1.Property.countDocuments({ status: "pending" }),
        property_model_1.Property.countDocuments({ status: "rejected" }),
        inquiry_model_1.Inquiry.countDocuments(),
        (await Promise.resolve().then(() => __importStar(require("../models/message.model")))).Message.countDocuments(),
    ]);
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
    });
});
//# sourceMappingURL=admin.controller.js.map