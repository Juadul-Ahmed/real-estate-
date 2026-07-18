import { Schema, model, models, Document } from "mongoose";

export interface IMessage extends Document {
  inquiry: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  inquiry: { type: Schema.Types.ObjectId, ref: "Inquiry", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Message = models.Message || model<IMessage>("Message", messageSchema);
