import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId; // Who receives the notification
  senderId: mongoose.Types.ObjectId; // Who triggered the notification
  type: 'like' | 'comment';
  message: string;
  blogId: mongoose.Types.ObjectId; // The blog that was liked/commented on
  blogTitle?: string; // Store blog title for quick reference
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'comment'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    blogTitle: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Index for efficient queries
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
