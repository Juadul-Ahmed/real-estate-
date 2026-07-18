import { Schema, model, models, Document } from "mongoose";

export type InquiryStatus = "open" | "answered" | "closed";

export interface IInquiry extends Document {
  property: Schema.Types.ObjectId;
  buyer: Schema.Types.ObjectId;
  broker: Schema.Types.ObjectId;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
}

const inquirySchema = new Schema<IInquiry>({
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  broker: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
  createdAt: { type: Date, default: Date.now },
});

export const Inquiry = models.Inquiry || model<IInquiry>("Inquiry", inquirySchema);
