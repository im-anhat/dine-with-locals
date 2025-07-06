# Payment System Implementation Guide

This document explains how to use the Stripe payment system that has been implemented for managing payment methods without making immediate payments.

## Overview

The payment system allows users to:

- Add payment methods (credit/debit cards) without making a payment
- View all saved payment methods
- Set a default payment method
- Delete payment methods

## Backend Implementation

### Routes (All require authentication except createCustomer)

- `POST /api/payment/createCustomer` - Create a Stripe customer
- `POST /api/payment/setup-intent` - Create setup intent for adding payment methods
- `POST /api/payment/payment-methods` - Add a payment method
- `GET /api/payment/payment-methods` - Get all payment methods
- `PATCH /api/payment/payment-methods/default` - Set default payment method
- `DELETE /api/payment/payment-methods/:paymentMethodId` - Delete a payment method

### Controller Functions

1. **createStripeCustomer**: Creates a Stripe customer if one doesn't exist
2. **createSetupIntent**: Creates a setup intent for collecting payment methods
3. **addPaymentMethod**: Attaches a payment method to the user's Stripe customer
4. **getPaymentMethods**: Retrieves all payment methods for a user
5. **setDefaultPaymentMethod**: Sets a payment method as default
6. **deletePaymentMethod**: Removes a payment method

## Frontend Implementation

### Components

1. **AddPaymentMethod**: Form for adding new payment methods using Stripe Elements
2. **ShowPaymentMethod**: Displays all payment methods with options to set default or delete
3. **PaymentTest**: Example page showing both components in tabs

### Service Functions

The `PaymentService.ts` provides these functions:

- `createSetupIntent()`: Creates setup intent
- `addPaymentMethod(paymentMethodId)`: Adds payment method
- `getPaymentMethods()`: Gets all payment methods
- `setDefaultPaymentMethod(paymentMethodId)`: Sets default
- `deletePaymentMethod(paymentMethodId)`: Deletes payment method

## Usage Example

```tsx
import { useState } from 'react';
import AddPaymentMethod from '@/components/payment/AddPaymentMethod';
import ShowPaymentMethod from '@/components/payment/ShowPaymentMethod';

const PaymentPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePaymentMethodAdded = () => {
    setRefreshKey((prev) => prev + 1); // Refresh the list
  };

  return (
    <div>
      <ShowPaymentMethod key={refreshKey} />
      <AddPaymentMethod onSuccess={handlePaymentMethodAdded} />
    </div>
  );
};
```

## Required Environment Variables

### Server (.env)

```
STRIPE_SECRET_KEY=sk_test_...
SECRET=your_jwt_secret
```

### Client (.env)

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:3000/
```

## Database Schema

The User model includes these fields for payment management:

```typescript
{
  stripeCustomerId: string;        // Stripe customer ID
  paymentMethodDefault: string;    // Default payment method ID
  paymentMethod: string[];         // Array of payment method IDs
}
```

## Security Notes

- All payment method operations require authentication
- Payment methods are stored in Stripe, not in your database
- Only payment method IDs are stored in MongoDB
- Setup intents are used to collect payment methods without charging

## Testing

Use Stripe's test cards for testing:

- `4242424242424242` - Visa
- `4000000000003220` - 3D Secure authentication required
- `4000000000000002` - Card declined

## Next Steps

To make actual payments, you would:

1. Create a Payment Intent using the stored payment method
2. Confirm the payment intent
3. Handle the payment result

This current implementation focuses only on collecting and managing payment methods for future use.
