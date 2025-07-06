import { useState } from 'react';
import AddPaymentMethod from '@/components/payment/AddPaymentMethod';
import ShowPaymentMethod from '@/components/payment/ShowPaymentMethod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const PaymentTest = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');

  const handlePaymentMethodAdded = () => {
    // Refresh the payment methods list and switch to view tab
    setRefreshKey((prev) => prev + 1);
    setActiveTab('view');
    console.log('Payment method added successfully!');
  };

  const handlePaymentMethodChange = () => {
    // Refresh when payment methods are modified (deleted/default changed)
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Test</h1>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('view')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'view'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                View Methods
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'add'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Add Method
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activeTab === 'view' ? (
              <ShowPaymentMethod
                key={`view-${refreshKey}`}
                onPaymentMethodChange={handlePaymentMethodChange}
              />
            ) : (
              <AddPaymentMethod
                key={`add-${refreshKey}`}
                onSuccess={handlePaymentMethodAdded}
                onCancel={() => setActiveTab('view')}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentTest;
