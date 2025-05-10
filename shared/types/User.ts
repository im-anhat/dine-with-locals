export interface User {
  _id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  location: string;
  cover: string;
  socialLink: string;
  role: 'Host' | 'Guest';
  hobbies: string[];
  ethnicity: 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
  bio: string;
}

export type AuthenticatedUser = Omit<User, 'password'>;
export type UserLogin = Pick<User, 'userName' | 'password'>;
