import mongoose, { Schema } from 'mongoose';
const CommentSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
// Added composite unique index to simulate a composite primary key
CommentSchema.index({ blogId: 1, userId: 1, createdAt: 1 }, { unique: true });
export default mongoose.model('Comment', CommentSchema);
