import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  _id: mongoose.Types.ObjectId;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const LocationSchema: Schema = new Schema(
  {
    address: {
      type: String,
      default: '',
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: '',
      trim: true,
    },
    country: {
      type: String,
      default: 'USA',
      trim: true,
    },
    zipCode: {
      type: String,
      default: '',
      trim: true,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true },
);

export default mongoose.model<ILocation>('Location', LocationSchema);
