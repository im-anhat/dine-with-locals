import { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

//Create a new Stripe Customer if not already created
export const createStripeCustomer: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if the user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      res.status(400).json({
        error: 'Stripe customer already exists for this user',
      });
      return;
    }

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      name: `${user.firstName} ${user.lastName}`,
      metadata: { userId: user._id.toString() },
    });

    // Update the user's Stripe customer ID in MongoDB
    user.stripeCustomerId = customer.id;
    await user.save();

    res
      .status(201)
      .json({ message: 'Stripe customer created successfully', customer });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    res.status(500).json({ error: 'Failed to create Stripe customer' });
  }
};
