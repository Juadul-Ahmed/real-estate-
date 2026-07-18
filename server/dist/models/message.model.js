"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    inquiry: { type: mongoose_1.Schema.Types.ObjectId, ref: "Inquiry", required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.Message = mongoose_1.models.Message || (0, mongoose_1.model)("Message", messageSchema);
//# sourceMappingURL=message.model.js.map