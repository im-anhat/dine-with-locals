import mongoose, { Schema, Document } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose as any);

export interface IRequest extends Document {
  requestId: number;
  userId: number; // References User.userID
  createdAt: Date;
  title: string;
  locationType: 'home' | 'res';
  location: string;
  interestTopic: string;
  time?: Date;
  cuisine: string[];
  dietaryRestriction: string[];
  numGuests: number;
  additionalInfo: string;
  status: string;
}

const RequestSchema: Schema = new Schema(
  {
    requestId: {
      type: Number,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      ref: 'User', // Reference to the User model (using userID)
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    locationType: {
      type: String,
      enum: ['home', 'res'],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    interestTopic: {
      type: String,
      trim: true,
      default: '',
    },
    time: {
      type: Date,
      required: true,
    },
    cuisine: {
      type: [String],
      default: [],
    },
    dietaryRestriction: {
      type: [String],
      default: [],
    },
    numGuests: {
      type: Number,
      default: 1,
    },
    additionalInfo: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: 'pending',
      trim: true,
    },
  },
  { timestamps: true },
);

// Apply auto-increment plugin to requestId
RequestSchema.plugin(AutoIncrement as any, { inc_field: 'requestId' });

export default mongoose.model<IRequest>('Request', RequestSchema);
