import mongoose, { Schema, Document } from 'mongoose';

// Base interface for listing
interface IBaseListing extends Document{
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  imagesUrl?: string[];
  category: 'dining' | 'travel' | 'event';
  locationId: mongoose.Types.ObjectId;
  additionalInfo?: string;
  status: 'pending' | 'waiting' | 'approved';
  time?: Date;
  duration?: number;
  interestTopic?: string[];
  numGuests?: number;
}

interface IDiningListing extends IBaseListing {
  category: 'dining';
  cuisine?: string[];
  dietary?: string[];
}

interface ITravelListing extends IBaseListing {
  category: 'travel';
  // maybe: itinerary, transportation
}

interface IEventListing extends IBaseListing {
  category: 'event';
}

export interface IListing extends Document {
  userId: mongoose.Types.ObjectId; // now using ObjectId
  title: string;
  description: string;
  imagesUrl: string[];
  category: 'Dining' | 'Travel' | 'Event';
  locationId: mongoose.Types.ObjectId; // now using default _id from Location
  interestTopic?: string[];
  time?: Date;
  duration?: number;
  cuisine: string[];
  dietary: string[];
  numGuests?: number;
  additionalInfo: string;
  status: 'pending' | 'waiting' | 'approved';
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
      default: 1,
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
