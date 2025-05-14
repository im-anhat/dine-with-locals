import { Model, Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserLogin } from '../../../shared/types/User.js';
import validator from 'validator';
import { SALT } from '../seeds/constants.js';

//-------------Repllace the IUser interface with the imported User interface from shared/types/User.ts----------

// export interface IUser extends Document {
//   userName: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
//   password: string;
//   avatar: string;
//   cover?: string;
//   socialLink: string;
//   role: 'Host' | 'Guest' | 'Both';
//   hobbies: string[];
//   ethnicity?: 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
//   bio: string;
// }
//-------------------------------------------------------------------------------------------------------------

const UserSchema: Schema<User> = new Schema<User>(
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
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
      trim: true,
    },
    cover: {
      type: String,
      default: '',
      trim: true,
    },
    socialLink: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      enum: ['Host', 'Guest'],
      required: true,
      default: 'Guest',
    },
    hobbies: {
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
  },
  { timestamps: true },
);

const UserModel = model<User>('User', UserSchema);
export default UserModel;
