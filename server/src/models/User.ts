import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose as any);

export interface IUser extends Document {
  userId: number;
  userName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password: string;
  avatar: string;
  socialLink: string;
  role: 'Host' | 'Guest' | 'Both';
  hobbies: string[];
  ethnicity?: string;
  bio: string;
}

const UserSchema: Schema = new Schema(
  {
    userId: {
      type: Number,
      unique: true,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
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

// Pre-save hook to hash password if it's new or modified
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

// Cast AutoIncrement to any in order to avoid type errors.
UserSchema.plugin(AutoIncrement as any, { inc_field: 'userId' });

export default mongoose.model<IUser>('User', UserSchema);
