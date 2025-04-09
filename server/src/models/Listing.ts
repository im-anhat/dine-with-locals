import mongoose, { Schema, Document } from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose as any);

export interface IListing extends Document {
  userId: number; // foreign key referencing User.userID
  listingId: number; // auto-incremented listing identifier
  createdAt: Date;
  title: string;
  locationType: 'home' | 'res';
  location: string;
  interestTopic?: string;
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
      type: Number,
      ref: 'User', // Reference to the User model
      required: true,
    },
    listingId: {
      type: Number,
      unique: true,
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
      required: true,
      default: 'waiting',
    },
  },
  { timestamps: true },
);

// Apply auto-increment plugin to listingID
ListingSchema.plugin(AutoIncrement as any, { inc_field: 'listingId' });

export default mongoose.model<IListing>('Listing', ListingSchema);
