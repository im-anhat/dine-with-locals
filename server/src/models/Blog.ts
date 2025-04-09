import mongoose, { Schema, Document } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose as any);

export interface IBlog extends Document {
  blogId: number; // auto-incremented blog identifier
  userId: number; // refers to User.userID
  createdAt: Date;
  blogTitle: string;
  blogContent: string;
  photos: string[];
}

const BlogSchema: Schema = new Schema({
  blogId: {
    type: Number,
    required: true,
    unique: true,
    // No need for trim with numbers.
  },
  userId: {
    type: Number,
    required: true,
    ref: 'User', // Reference to the User collection
  },
  createdAt: {
    type: Date,
    default: Date.now, // automatically sets creation timestamp
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
    type: [String], // array of image URLs
    default: [],
  },
});

// Apply auto-increment plugin to blogId field
BlogSchema.plugin(AutoIncrement as any, { inc_field: 'blogId' });

export default mongoose.model<IBlog>('Blog', BlogSchema);
