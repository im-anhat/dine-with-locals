import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  userId: mongoose.Types.ObjectId; // now using ObjectId
  title: string;
  description: string;
  images?: string[]; //urls of images
  category: 'dining' | 'travel' | 'event';
  locationId: mongoose.Types.ObjectId; // now using default _id from Location
  additionalInfo?: string;
  status: 'pending' | 'waiting' | 'approved';
  time?: Date;
  duration?: number;
  interestTopic?: string[];
  numGuests?: number;
  // Dining specific properties
  cuisine?: string[];
  dietary?: string[];
}

const ListingSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['dining', 'travel', 'event'],
      required: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Location',
    },
    additionalInfo: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'waiting', 'approved'],
      default: 'waiting',
    },
    time: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    interestTopic: {
      type: [String],
      default: [],
    },
    numGuests: {
      type: Number,
      default: 1,
    },
    cuisine: {
      type: [String],
      default: [],
    },
    dietary: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model<IListing>('Listing', ListingSchema);
