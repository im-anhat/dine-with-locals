import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId; // References User._id
  blogId: mongoose.Types.ObjectId; // References Blog._id
  createdAt: Date;
}

const LikeSchema: Schema = new Schema(
  {
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

LikeSchema.index({ userId: 1, blogId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
