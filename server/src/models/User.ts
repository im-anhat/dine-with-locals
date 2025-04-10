import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  userName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password: string;
  avatar: string;
  cover?: string;
  socialLink: string;
  role: 'Host' | 'Guest' | 'Both';
  hobbies: string[];
  ethnicity?: string;
  bio: string;
}

const UserSchema: Schema = new Schema(
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
      enum: ['Host', 'Guest', 'Both'],
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

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

export default mongoose.model<IUser>('User', UserSchema);
