import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  chatName: string;
  isGroupChat: boolean;
  users: mongoose.Types.ObjectId[]; // References User._id
  latestMessage?: mongoose.Types.ObjectId; // References Message._id
  groupAdmin?: mongoose.Types.ObjectId; // References User._id
  listing?: mongoose.Types.ObjectId; // Optional reference to a Listing._id
}

const ChatSchema: Schema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: false, // Optional reference to a Listing
    },
  },
  { timestamps: true },
);

export default mongoose.model<IChat>('Chat', ChatSchema);
