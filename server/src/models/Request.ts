import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  userId: mongoose.Types.ObjectId; // References User._id
  createdAt: Date;
  title: string;
  locationType: 'home' | 'res' | 'either';
  locationId: mongoose.Types.ObjectId; // References Location._id
  interestTopic: string[];
  time: Date;
  cuisine: string[];
  dietaryRestriction: string[];
  numGuests: number;
  additionalInfo: string;
  status: 'waiting' | 'pending' | 'approved';
}

const RequestSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
      enum: ['home', 'res', 'either'],
      required: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Location',
    },
    interestTopic: {
      type: [String],
      default: [],
      trim: true,
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
      enum: ['waiting', 'pending', 'approved'],
      default: 'waiting',
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IRequest>('Request', RequestSchema);
