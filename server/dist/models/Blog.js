import mongoose, { Schema } from 'mongoose';
const BlogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    blogTitle: {
        type: String,
        required: true,
        trim: true,
    },
    blogContent: {
        type: String,
        trim: true,
        required: true,
    },
    photos: {
        type: [String],
        default: [],
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    listingId: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: false,
    },
}, { timestamps: true });
export default mongoose.model('Blog', BlogSchema);
