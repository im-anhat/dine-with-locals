import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  name?: string;
  place_id?: string;
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
    name: {
      type: String,
      default: '',
      trim: true,
    },
    //Google Maps place_id
    place_id: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ILocation>('Location', LocationSchema);
