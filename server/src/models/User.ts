import mongoose, { Model, Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  userName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  provider: 'Local' | 'Google';
  password: string;
  avatar: string;
  cover?: string;
  socialLink: string;
  role: 'Host' | 'Guest' | 'Both';
  hobbies: string[];
  cuisines: string[];
  ethnicity?: 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
  bio: string;
  locationId: mongoose.Types.ObjectId;
  languages: string[];
  stripeCustomerId: string;
  paymentMethodDefault: string;
  paymentMethod: string[];
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: function (this: IUser) {
        return this.provider === 'Local';
      },
    },
    provider: {
      type: String,
      enum: ['Local', 'Google'],
      default: 'Local',
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider === 'Local';
      },
    },
    avatar: {
      type: String,
      default: '',
      trim: true,
    },
    cover: {
      type: String,
      default:
        'https://iwritingsolutions.com/wp-content/uploads/2022/05/starry-sky-night-dark-wallpaper-preview-1.jpg',
    },
    socialLink: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      enum: ['Host', 'Guest'],
      required: function (this: IUser) {
        return this.provider === 'Local';
      },
      default: 'Guest',
    },
    hobbies: {
      type: [String],
      default: [],
    },
    cuisines: {
      type: [String],
      default: [],
    },
    ethnicity: {
      type: String,
      enum: ['Asian', 'Black', 'Hispanic', 'White', 'Other'],
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: function (this: IUser) {
        return this.provider === 'Local';
      },
    },
    languages: {
      type: [String],
      default: [],
    },
    stripeCustomerId: {
      type: String,
      default: '',
      trim: true,
      sparse: true,
    },
    paymentMethodDefault: {
      type: String,
      default: '',
      trim: true,
    },
    paymentMethod: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const UserModel = model<IUser>('User', UserSchema);
export default UserModel;
