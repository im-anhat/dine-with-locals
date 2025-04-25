import { Model, Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { User, UserLogin } from '../../../shared/types/User.js';
import validator from 'validator'; // Importing validator for email validation
import { SALT } from '../seeds/constants.js'; // Importing the SALT constant for password hashing
//Relative imports must include the file extension (like .js)
//Even though the original file is writing .ts files, they will compile to .js

/**
 * This model interface extends the standard Mongoose model interface with custom static methods.
 * Extending Model<User> gives methods like .find(), .create(), .findOne() etc. on the model.
 * (1) Schema constructor
 * (2) Model
 **/
interface UserModel extends Model<User> {
  signup(user: User): Promise<User & Document>;
  login(user: UserLogin): Promise<User & Document>;
}

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

// Create a new Model type that knows about IUserMethods...
// Mongoose models do not have an explicit generic parameter for statics.
// Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document.
// Models are responsible for creating and reading documents from the underlying MongoDB database.

/**
 * 2. Create a Schema corresponding to the document interface.
 * @param document interface
 * @param model interface
 * @param methods interface
 * */
const UserSchema: Schema<User, UserModel> = new Schema<User, UserModel>(
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

//-----------------------STATIC METHODS FOR MODEL----------------------------

/**
 * This static method is used to create a new User document in users collection.
 * @param this - The UserModel instance
 * @param user - The user object containing user details
 * @returns A promise that resolves to the created User document
 * @throws Error if any of the required fields are missing or invalid
 * @throws Error if the input is not valid
 * @throws Error if the user creation fails
 */
async function signup(this: UserModel, user: User): Promise<User & Document> {
  // Destructure the user object to get the required fields
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

  //Input validation
  if (!userName || !password) {
    throw new Error('All fields must be filled');
  }
  if (!validator.isMobilePhone(phone, 'any')) {
    throw new Error('Phone not valid');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password not strong enough');
  }
  if (socialLink && !validator.isURL(socialLink)) {
    throw new Error('Social link not valid');
  }

  // Check if the userName is already in use
  const existing = await this.findOne({ userName });
  if (existing) {
    throw new Error('Username already in use');
  }

  // salt used to hash the password.
  const salt = await bcrypt.genSalt(SALT);
  // hashes the password using the salt.
  const hash = await bcrypt.hash(password, salt);

  //Create a new document in the collection
  const exists = await this.create({
    ...user,
    password: hash,
  });

  return exists;
}
/**
 * This static method is used to authenticate a user during login.
 * It checks if the provided username and password match an existing user in the database.
 * If the credentials are valid, it returns the user document.
 * If the credentials are invalid, it throws an error.
 * @param this - The UserModel instance
 * @param user - The userLogin object containing username and password
 * @returns A promise that resolves to the retrieved User document
 * @throws Error if any of the required fields are missing or invalid
 * @throws Error if the input is not valid
 * @throws Error if the user creation fails
 */
async function login(
  this: UserModel,
  user: UserLogin,
): Promise<User & Document> {
  // Destructure the user object to get the required fields
  const { userName, password } = user;

  //Input validation
  if (!userName || !password) {
    throw new Error('All fields must be filled');
  }

  // Check if the userName is already in use
  const returnUser = await this.findOne({
    userName,
  });
  if (!returnUser) {
    throw new Error('Username not found');
  }
  // Check if the password is correct
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
