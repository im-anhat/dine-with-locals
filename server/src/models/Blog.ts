import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  userId: mongoose.Types.ObjectId; // References User._id
  blogTitle: string;
  blogContent: string;
  photos: string[];
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
    },
    photos: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
