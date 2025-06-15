import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  userId: mongoose.Types.ObjectId; // References User._id
  blogTitle: string;
  blogContent: string;
  photos: string[];
  likes: number;
  comments: number;
  listingId?: mongoose.Types.ObjectId;
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
  },
  { timestamps: true },
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
