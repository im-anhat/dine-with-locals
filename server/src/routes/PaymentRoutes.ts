import express from 'express';
import {
  createStripeCustomer,
  addPaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  createSetupIntent,
} from '../controllers/PaymentController.js';

const router = express.Router();

// Create a new Stripe customer
router.post('/createCustomer', createStripeCustomer);

// Create setup intent for adding payment methods
router.post('/setup-intent', createSetupIntent);

// Add a payment method
router.post('/payment-methods', addPaymentMethod);

// Get all payment methods for user
router.get('/payment-methods/:userId', getPaymentMethods);

// Set default payment method
router.patch('/payment-methods/default', setDefaultPaymentMethod);

// Delete a payment method
router.delete('/payment-methods/:paymentMethodId', deletePaymentMethod);

export default router;
