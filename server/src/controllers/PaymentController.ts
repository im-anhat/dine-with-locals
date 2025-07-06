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

// Add a payment method to user account (without making a payment)
export const addPaymentMethod: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, paymentMethodId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    if (!paymentMethodId) {
      res.status(400).json({ error: 'Payment method ID is required' });
      return;
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Ensure user has a Stripe customer ID
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      // Create Stripe customer if doesn't exist
      const customer = await stripe.customers.create({
        name: `${user.firstName} ${user.lastName}`,
        metadata: { userId: user._id.toString() },
      });
      stripeCustomerId = customer.id;

      // Update user with stripe customer ID
      await User.findByIdAndUpdate(user._id, { stripeCustomerId });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Add payment method ID to user's payment methods array
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: { paymentMethod: paymentMethodId },
        // Set as default if it's the first payment method
        ...(user.paymentMethod.length === 0 && {
          paymentMethodDefault: paymentMethodId,
        }),
      },
      { new: true },
    );

    res.status(201).json({
      message: 'Payment method added successfully',
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card
          ? {
              brand: paymentMethod.card.brand,
              last4: paymentMethod.card.last4,
              exp_month: paymentMethod.card.exp_month,
              exp_year: paymentMethod.card.exp_year,
            }
          : null,
        isDefault: updatedUser?.paymentMethodDefault === paymentMethodId,
      },
    });
  } catch (error: any) {
    console.error('Error adding payment method:', error);
    res.status(500).json({
      error: 'Failed to add payment method',
      details: error.message,
    });
  }
};

// Get all payment methods for the authenticated user
export const getPaymentMethods: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (!user.stripeCustomerId) {
      res.status(200).json({ paymentMethods: [] });
      return;
    }

    // Get payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    // Format payment methods with additional info
    const formattedPaymentMethods = paymentMethods.data.map((pm) => ({
      id: pm.id,
      type: pm.type,
      card: pm.card
        ? {
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year,
          }
        : null,
      isDefault: user.paymentMethodDefault === pm.id,
      created: pm.created,
    }));

    res.status(200).json({ paymentMethods: formattedPaymentMethods });
  } catch (error: any) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      error: 'Failed to fetch payment methods',
      details: error.message,
    });
  }
};

// Set a payment method as default
export const setDefaultPaymentMethod: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, paymentMethodId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    if (!paymentMethodId) {
      res.status(400).json({ error: 'Payment method ID is required' });
      return;
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if payment method exists in user's payment methods
    if (!user.paymentMethod.includes(paymentMethodId)) {
      res.status(404).json({ error: 'Payment method not found for this user' });
      return;
    }

    // Update user's default payment method
    await User.findByIdAndUpdate(user._id, {
      paymentMethodDefault: paymentMethodId,
    });

    // Update default payment method in Stripe (for future invoices)
    if (user.stripeCustomerId) {
      await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    res.status(200).json({
      message: 'Default payment method updated successfully',
      defaultPaymentMethodId: paymentMethodId,
    });
  } catch (error: any) {
    console.error('Error setting default payment method:', error);
    res.status(500).json({
      error: 'Failed to set default payment method',
      details: error.message,
    });
  }
};

// Delete a payment method
export const deletePaymentMethod: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.body;
    const { paymentMethodId } = req.params;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    if (!paymentMethodId) {
      res.status(400).json({ error: 'Payment method ID is required' });
      return;
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if payment method exists in user's payment methods
    if (!user.paymentMethod.includes(paymentMethodId)) {
      res.status(404).json({ error: 'Payment method not found for this user' });
      return;
    }

    // Detach payment method from Stripe customer
    await stripe.paymentMethods.detach(paymentMethodId);

    // Remove payment method from user's array
    const updateData: any = {
      $pull: { paymentMethod: paymentMethodId },
    };

    // If this was the default payment method, clear the default
    if (user.paymentMethodDefault === paymentMethodId) {
      updateData.paymentMethodDefault = '';
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, updateData, {
      new: true,
    });

    // If there are remaining payment methods and no default is set, set the first one as default
    if (
      updatedUser &&
      updatedUser.paymentMethod.length > 0 &&
      !updatedUser.paymentMethodDefault
    ) {
      await User.findByIdAndUpdate(user._id, {
        paymentMethodDefault: updatedUser.paymentMethod[0],
      });
    }

    res.status(200).json({
      message: 'Payment method deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({
      error: 'Failed to delete payment method',
      details: error.message,
    });
  }
};

// Create a setup intent for adding payment methods without immediate payment
export const createSetupIntent: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: 'Invalid user ID format' });
      return;
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Ensure user has a Stripe customer ID
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      // Create Stripe customer if doesn't exist
      const customer = await stripe.customers.create({
        name: `${user.firstName} ${user.lastName}`,
        metadata: { userId: user._id.toString() },
      });
      stripeCustomerId = customer.id;

      // Update user with stripe customer ID
      await User.findByIdAndUpdate(user._id, { stripeCustomerId });
    }

    // Create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session', // For future payments
    });

    res.status(200).json({
      client_secret: setupIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({
      error: 'Failed to create setup intent',
      details: error.message,
    });
  }
};
