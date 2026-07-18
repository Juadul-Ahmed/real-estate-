import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/validate";
import { inquirySchema, messageSchema } from "../validators";
import { Inquiry } from "../models/inquiry.model";
import { Property } from "../models/property.model";
import { Message } from "../models/message.model";

function populateInquiry(query: any) {
  return query
    .populate("property", "title type city address price images")
    .populate("buyer", "name email phone avatar")
    .populate("broker", "name email phone avatar");
}

export const createInquiry = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { propertyId, message } = inquirySchema.parse(req.body);
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404).json({ message: "Property not found" });
    return;
  }
  if (property.owner.toString() === req.user!.id) {
    res.status(400).json({ message: "You cannot inquire on your own listing" });
    return;
  }
  const inquiry = await Inquiry.create({
    property: propertyId,
    buyer: req.user!.id,
    broker: property.owner,
    message,
  });
  res.status(201).json({ inquiry: await populateInquiry(Inquiry.findById(inquiry._id)) });
});

export const listInquiriesForBuyer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const inquiries = await populateInquiry(
    Inquiry.find({ buyer: req.user!.id }).sort({ createdAt: -1 })
  );
  res.json({ inquiries });
});

export const listInquiriesForBroker = asyncHandler(async (req: AuthRequest, res: Response) => {
  const inquiries = await populateInquiry(
    Inquiry.find({ broker: req.user!.id }).sort({ createdAt: -1 })
  );
  res.json({ inquiries });
});

export const getInquiryMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (!inquiry) {
    res.status(404).json({ message: "Inquiry not found" });
    return;
  }
  if (inquiry.buyer.toString() !== req.user!.id && inquiry.broker.toString() !== req.user!.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  const messages = await Message.find({ inquiry: req.params.id })
    .populate("sender", "name role avatar")
    .sort({ createdAt: 1 });
  res.json({ messages });
});

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { inquiryId, text } = messageSchema.parse(req.body);
  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) {
    res.status(404).json({ message: "Inquiry not found" });
    return;
  }
  if (inquiry.buyer.toString() !== req.user!.id && inquiry.broker.toString() !== req.user!.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  const message = await Message.create({ inquiry: inquiryId, sender: req.user!.id, text });
  inquiry.status = "answered";
  await inquiry.save();
  res.status(201).json({ message: await message.populate("sender", "name role avatar") });
});
