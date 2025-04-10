import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  blogId: mongoose.Types.ObjectId; // References Blog._id
  userId: mongoose.Types.ObjectId; // References User._id
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

// Added composite unique index to simulate a composite primary key
CommentSchema.index({ blogId: 1, userId: 1, createdAt: 1 }, { unique: true });

export default mongoose.model<IComment>('Comment', CommentSchema);
