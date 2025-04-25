// import { Request, Response } from 'express';
// import User from '../models/User.js';

// export const getUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// };

// export const createUser = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;
//     const newUser = await User.create({ name, email, password });
//     res.status(201).json(newUser);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create user' });
//   }
// };
