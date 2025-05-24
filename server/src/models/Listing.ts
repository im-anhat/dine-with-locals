import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  images?: string[];
  category: 'dining' | 'travel' | 'event';
  locationId: string;
  additionalInfo?: string;
  status: 'pending' | 'waiting' | 'approved';
  time?: Date;
  duration?: number;
  interestTopic?: string[];
  numGuests?: number;
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
    // locationId refers to the _id field in the Location model, not place_id
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
