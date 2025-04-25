import User, { IUser } from '../models/ExampleUser';

export const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  return await User.create(data);
};
