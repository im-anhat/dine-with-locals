import { useState } from 'react';
import AddPaymentMethod from '@/components/payment/AddPaymentMethod';

const PaymentTest = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePaymentMethodAdded = () => {
    // Refresh the payment methods list
    setRefreshKey((prev) => prev + 1);
    console.log('Payment method added successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Test</h1>
        <p className="text-gray-600">Test adding payment methods with Stripe</p>
      </div>

      <div className="flex justify-center">
        <AddPaymentMethod
          key={refreshKey}
          onSuccess={handlePaymentMethodAdded}
        />
      </div>
    </div>
  );
};

export default PaymentTest;
