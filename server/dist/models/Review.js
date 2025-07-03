// filepath: /Users/nhatle/Documents/vtmp/dine-with-locals/server/src/models/Review.ts
import mongoose, { Schema } from 'mongoose';
const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reviewerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer',
        },
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });
// Prevent duplicate reviews from the same reviewer for the same user
ReviewSchema.index({ userId: 1, reviewerId: 1 }, { unique: true });
export default mongoose.model('Review', ReviewSchema);
