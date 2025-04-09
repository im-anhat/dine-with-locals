import mongoose, { Schema, Document } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose as any);

export interface IComment extends Document {
  commentId: number; // auto-incremented comment identifier
  blogId: number; // references Blog.blogId
  userId: number; // references User.userId
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    commentId: {
      type: Number,
      required: true,
      unique: true,
    },
    blogId: {
      type: Number,
      ref: 'Blog', // Reference to the Blog collection (matching blogId in Blog.ts)
      required: true,
    },
    userId: {
      type: Number,
      ref: 'User', // Reference to the User collection (matching userId in User.ts)
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Apply auto-increment plugin to commentId field
CommentSchema.plugin(AutoIncrement as any, { inc_field: 'commentId' });

export default mongoose.model<IComment>('Comment', CommentSchema);
