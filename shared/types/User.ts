export interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
  socialLink: string;
  role: 'Host' | 'Guest' | 'Both';
  hobbies: string[];
  ethnicity: 'Asian' | 'Black' | 'Hispanic' | 'White' | 'Other';
  bio: string;
}

export interface UserLogin {
  userName: string;
  password: string;
}
