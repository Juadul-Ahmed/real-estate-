import { Schema, model, models, Document } from "mongoose";

export interface IChatMessage extends Document {
  sessionId: string;
  role: "user" | "assistant";
  text: string;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>({
  sessionId: { type: String, required: true, index: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const ChatMessage = models.ChatMessage || model<IChatMessage>("ChatMessage", chatMessageSchema);
