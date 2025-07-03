import mongoose, { Schema } from 'mongoose';
const LikeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    blogId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Blog',
    },
}, { timestamps: true });
LikeSchema.index({ userId: 1, blogId: 1 }, { unique: true });
export default mongoose.model('Like', LikeSchema);
