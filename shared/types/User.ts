export interface User {
  _id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  socialLink: string;
  role: 'Host' | 'Guest';
  hobbies: string[];
  cuisines: string[];
  ethnicity: 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
  bio: string;
  cover: string;
  locationId: string;
  languages: string[];
}

export type UserSignUp = Pick<
  User,
  | 'userName'
  | 'password'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'role'
  | 'avatar'
>;
export type AuthenticatedUser = Omit<User, 'password'>;
export type UserLogin = Pick<User, 'userName' | 'password'>;
