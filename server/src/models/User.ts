import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserLogin } from '../../../shared/types/User.js';
import validator from 'validator'; // Importing validator for email validation
//Relative imports must include the file extension (like .js)
//Even though the original file is writing .ts files, they will compile to .js

export interface IUser extends Document {
  userName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password: string;
  avatar: string;
  cover?: string;
  socialLink: string;
  role: 'Host' | 'Guest' | 'Both';
  hobbies: string[];
  ethnicity?: 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
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

//A Mongoose middleware that runs before a document is saved.
// It checks if the password field has been modified, and if so, it hashes the password using bcrypt.
// If the password is not modified, it simply calls next() to proceed with the save operation.
// If an error occurs during the hashing process, it calls next() with the error to handle it appropriately.
// This middleware is crucial for ensuring that user passwords are securely hashed before being stored in the database.
// This is important for security, as it ensures that passwords are not stored in plain text in the database.
// The middleware uses bcrypt to generate a salt and hash the password.
// If the password is not modified, it simply calls next() to proceed with the save operation.
// UserSchema.pre<IUser>('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   try {
//     //// The middleware uses bcrypt to generate a salt and hash the password.
//     // This is important for security, as it ensures that passwords are not stored in plain text in the database.
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error as any); // If the password is not modified, it simply calls next() to proceed with the save operation.
//   }
// });

// export default mongoose.model<IUser>('User', UserSchema);

UserSchema.statics.signup = async function (user: User) {
  const {
    userName,
    firstName,
    lastName,
    phone,
    password,
    avatar,
    socialLink,
    role,
    hobbies,
  } = user;
  if (!userName || !password) {
    throw new Error('All fields must be filled');
  }
  if (!validator.isMobilePhone(phone, 'any')) {
    throw new Error('Phone not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password not strong enough');
  }
  if (!validator.isURL(socialLink)) {
    throw new Error('Password not strong enough');
  }

  const exists = await (this as mongoose.Model<IUser>).findOne({ userName });

  if (exists) {
    throw new Error('Email already in use');
  }
  return exists;
};

UserSchema.statics.login = async function (user: UserLogin) {
  const { userName, password } = user;
  if (!userName || !password) {
    throw new Error('All fields must be filled');
  }

  const returnUser = await (this as mongoose.Model<IUser>).findOne({
    userName,
  });
  if (!returnUser) {
    throw new Error('Username not found');
  }

  const match = await bcrypt.compare(password, returnUser.password);
  if (!match) {
    throw Error('Incorrect password');
  }
  return returnUser;
};

module.exports = mongoose.model('User', UserSchema);
