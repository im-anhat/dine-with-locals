import mongoose, { Schema } from 'mongoose';
const MessageSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model('Message', MessageSchema);
