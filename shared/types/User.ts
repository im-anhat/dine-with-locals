export interface User {
  userId: number;
  userName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar: string;
  socialLink: string;
  role: 'Host' | 'Guest' | 'Both';
  hobbies: string[];
  ethnicity?: string;
  bio: string;
}

export interface UserLogin {
  userName: string;
  password: string;
}
