import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  senderId: mongoose.Types.ObjectId; // References User._id
  content: string;
  chat: mongoose.Types.ObjectId; // References Chat._id
  readBy: mongoose.Types.ObjectId[]; // References User._id
}

const MessageSchema: Schema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Chat',
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  { timestamps: true },
);

export default mongoose.model<IChat>('Message', MessageSchema);