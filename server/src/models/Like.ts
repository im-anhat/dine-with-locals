import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  userId: number; // references User.userId
  blogId: string; // references Blog.blogId (as a string)
  createdAt: Date;
}

const LikeSchema: Schema = new Schema(
  {
    userId: {
      type: Number,
      required: true,
      ref: 'User',
    },
    blogId: {
      type: String,
      required: true,
      ref: 'Blog',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Compound index to ensure a user can like a blog only once
LikeSchema.index({ userId: 1, blogId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
