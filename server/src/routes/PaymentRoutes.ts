import express from 'express';
import { createStripeCustomer } from '../controllers/PaymentController.js';

const router = express.Router();

//Create a new Stripe customer
router.post('/createCustomer', createStripeCustomer);

export default router;
