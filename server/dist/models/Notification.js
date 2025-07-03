import mongoose, { Schema } from 'mongoose';
const NotificationSchema = new Schema({
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
}, { timestamps: true });
// Index for efficient queries
NotificationSchema.index({ recipientId: 1, createdAt: -1 });
NotificationSchema.index({ recipientId: 1, isRead: 1 });
export default mongoose.model('Notification', NotificationSchema);
