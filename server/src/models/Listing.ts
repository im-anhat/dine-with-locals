import mongoose, { Schema, Document } from 'mongoose';

export interface IListing extends Document {
  userId: mongoose.Types.ObjectId; // now using ObjectId
  title: string;
  locationType: 'home' | 'res' | 'either';
  locationId: mongoose.Types.ObjectId; // now using default _id from Location
  interestTopic?: string[];
  time?: Date;
  cuisine: string[];
  dietary: string[];
  numGuests?: number;
  additionalInfo: string;
  status: string;
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
    },
    time: {
      type: Date,
    },
    cuisine: {
      type: [String],
      default: [],
    },
    dietary: {
      type: [String],
      default: [],
    },
    numGuests: {
      type: Number,
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
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IListing>('Listing', ListingSchema);
