"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["buyer", "broker", "admin"], default: "buyer" },
    phone: { type: String },
    avatar: { type: String },
    bio: { type: String },
    brokerApproved: { type: Boolean, default: false },
    favorites: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Property" }],
    createdAt: { type: Date, default: Date.now },
});
exports.User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map