"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inquiry = void 0;
const mongoose_1 = require("mongoose");
const inquirySchema = new mongoose_1.Schema({
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: "Property", required: true },
    buyer: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    broker: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
    createdAt: { type: Date, default: Date.now },
});
exports.Inquiry = mongoose_1.models.Inquiry || (0, mongoose_1.model)("Inquiry", inquirySchema);
//# sourceMappingURL=inquiry.model.js.map