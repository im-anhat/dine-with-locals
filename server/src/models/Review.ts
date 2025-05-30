// filepath: /Users/nhatle/Documents/vtmp/dine-with-locals/server/src/models/Review.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId; // User being reviewed
  reviewerId: mongoose.Types.ObjectId; // User who wrote the review
  rating: number; // 1-5 stars
  content: string; // Review text
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true },
);

// Prevent duplicate reviews from the same reviewer for the same user
ReviewSchema.index({ userId: 1, reviewerId: 1 }, { unique: true });

export default mongoose.model<IReview>('Review', ReviewSchema);
