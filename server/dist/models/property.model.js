"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const mongoose_1 = require("mongoose");
const propertySchema = new mongoose_1.Schema({
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
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
exports.Property = mongoose_1.models.Property || (0, mongoose_1.model)("Property", propertySchema);
//# sourceMappingURL=property.model.js.map