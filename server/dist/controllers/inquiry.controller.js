"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getInquiryMessages = exports.listInquiriesForBroker = exports.listInquiriesForBuyer = exports.createInquiry = void 0;
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const inquiry_model_1 = require("../models/inquiry.model");
const property_model_1 = require("../models/property.model");
const message_model_1 = require("../models/message.model");
function populateInquiry(query) {
    return query
        .populate("property", "title type city address price images")
        .populate("buyer", "name email phone avatar")
        .populate("broker", "name email phone avatar");
}
exports.createInquiry = (0, validate_1.asyncHandler)(async (req, res) => {
    const { propertyId, message } = validators_1.inquirySchema.parse(req.body);
    const property = await property_model_1.Property.findById(propertyId);
    if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
    }
    if (property.owner.toString() === req.user.id) {
        res.status(400).json({ message: "You cannot inquire on your own listing" });
        return;
    }
    const inquiry = await inquiry_model_1.Inquiry.create({
        property: propertyId,
        buyer: req.user.id,
        broker: property.owner,
        message,
    });
    res.status(201).json({ inquiry: await populateInquiry(inquiry_model_1.Inquiry.findById(inquiry._id)) });
});
exports.listInquiriesForBuyer = (0, validate_1.asyncHandler)(async (req, res) => {
    const inquiries = await populateInquiry(inquiry_model_1.Inquiry.find({ buyer: req.user.id }).sort({ createdAt: -1 }));
    res.json({ inquiries });
});
exports.listInquiriesForBroker = (0, validate_1.asyncHandler)(async (req, res) => {
    const inquiries = await populateInquiry(inquiry_model_1.Inquiry.find({ broker: req.user.id }).sort({ createdAt: -1 }));
    res.json({ inquiries });
});
exports.getInquiryMessages = (0, validate_1.asyncHandler)(async (req, res) => {
    const inquiry = await inquiry_model_1.Inquiry.findById(req.params.id);
    if (!inquiry) {
        res.status(404).json({ message: "Inquiry not found" });
        return;
    }
    if (inquiry.buyer.toString() !== req.user.id && inquiry.broker.toString() !== req.user.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    const messages = await message_model_1.Message.find({ inquiry: req.params.id })
        .populate("sender", "name role avatar")
        .sort({ createdAt: 1 });
    res.json({ messages });
});
exports.sendMessage = (0, validate_1.asyncHandler)(async (req, res) => {
    const { inquiryId, text } = validators_1.messageSchema.parse(req.body);
    const inquiry = await inquiry_model_1.Inquiry.findById(inquiryId);
    if (!inquiry) {
        res.status(404).json({ message: "Inquiry not found" });
        return;
    }
    if (inquiry.buyer.toString() !== req.user.id && inquiry.broker.toString() !== req.user.id) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }
    const message = await message_model_1.Message.create({ inquiry: inquiryId, sender: req.user.id, text });
    inquiry.status = "answered";
    await inquiry.save();
    res.status(201).json({ message: await message.populate("sender", "name role avatar") });
});
//# sourceMappingURL=inquiry.controller.js.map