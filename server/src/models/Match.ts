import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  hostId: number; // References a User
  guestId: number; // References a User
  listingID?: number; // Optionally references a Listing
  reqID?: number; // Optionally references a Request
  status: 'pending' | 'approved';
  time: Date;
}

const MatchSchema: Schema = new Schema(
  {
    hostId: {
      type: Number,
      ref: 'User', // reference to User collection
      required: true,
    },
    guestId: {
      type: Number,
      ref: 'User', // reference to User collection
      required: true,
    },
    listingID: {
      type: Number,
      ref: 'Listing', // optional reference to Listing collection
    },
    reqID: {
      type: Number,
      ref: 'Request', // optional reference to Request collection
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
    time: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true },
);

// Enforce composite uniqueness on hostID, guestID, and time.
MatchSchema.index({ hostId: 1, guestId: 1, time: 1 }, { unique: true });

export default mongoose.model<IMatch>('Match', MatchSchema);
