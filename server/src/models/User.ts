import mongoose, { Model, Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserLogin } from '../../../shared/types/User.js';
import validator from 'validator'; // Importing validator for email validation
//Relative imports must include the file extension (like .js)
//Even though the original file is writing .ts files, they will compile to .js

// 1. Create an interface for the methods
// This interface extends the standard Mongoose model interface with custom static methods.
// Pass method interface as the 3rd generic parameter to
// Model<User> gives methods like .find(), .create(), .findOne() etc. on the model.
// (1) Schema constructor
// (2) Model
interface IUserMethods extends Model<User> {
  signup(this: UserModel, user: User): Promise<User & Document>;
  login(this: UserModel, user: UserLogin): Promise<User & Document>;
}

//Repllace the IUser interface with the imported User interface from shared/types/User.ts

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

// Create a new Model type that knows about IUserMethods...
// Mongoose models do not have an explicit generic parameter for statics.
type UserModel = Model<User, {}, IUserMethods>;

// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.

/**
 * 2. Create a Schema corresponding to the document interface.
 * @param document interface
 * @param model interface
 * @param methods interface
 * */
const UserSchema: Schema = new Schema<User, UserModel, IUserMethods>(
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

//-------------STATIC METHODS FOR MODEL------------------
async function signup(this: UserModel, user: User): Promise<User & Document> {
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

  //Check if mandatory fields are filled
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

  // Check if the userName is already in use
  const existing = await this.findOne({ userName });
  if (existing) {
    throw new Error('Username already in use');
  }

  const salt = await bcrypt.genSalt(10);
  // hashes the password using the salt.
  const hash = await bcrypt.hash(password, salt);

  const exists = await this.create({
    ...user,
    password: hash,
  });

  if (exists) {
    throw new Error('Email already in use');
  }
  return exists;
}

async function login(
  this: UserModel,
  user: UserLogin,
): Promise<User & Document> {
  const { userName, password } = user;
  if (!userName || !password) {
    throw new Error('All fields must be filled');
  }

  const returnUser = await this.findOne({
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
}
// 2. Add static methods to the schema
UserSchema.static('signup', signup);
UserSchema.static('login', login);

// 3. Create a Model.
const UserModel = model<User, UserModel>('User', UserSchema);
export default UserModel;
