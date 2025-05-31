import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  userId: mongoose.Types.ObjectId; // References User._id
  blogTitle: string;
  blogContent: string;
  photos: string[];
  likes: number; // Track number of likes
  comments: number; // Track number of comments
}

const BlogSchema: Schema = new Schema(
  {
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
      default: 0, // Default to zero likes
    },
    comments: {
      type: Number,
      default: 0, // Default to zero comments
    },
  },
  { timestamps: true },
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
