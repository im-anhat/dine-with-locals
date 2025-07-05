import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  hostId: mongoose.Types.ObjectId; // References User._id
  guestId: mongoose.Types.ObjectId; // References User._id
  listingId?: mongoose.Types.ObjectId; // References Listing._id
  requestId?: mongoose.Types.ObjectId; // References Request._id
  status: 'pending' | 'approved';
  time?: Date;
}

const MatchSchema: Schema = new Schema(
  {
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    guestId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: 'Request',
    },
    status: {
      type: String,
      enum: ['pending', 'approved'],
      default: 'pending',
    },
    time: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Update composite index to use ObjectId fields
MatchSchema.index({ hostId: 1, guestId: 1, listingId: 1 }, { unique: true });

export default mongoose.model<IMatch>('Match', MatchSchema);
