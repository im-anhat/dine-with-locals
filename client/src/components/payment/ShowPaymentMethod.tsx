import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard, Trash2, Star, StarOff } from 'lucide-react';
import {
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  type PaymentMethod,
} from '@/services/PaymentService';
import { useUser } from '@/contexts/UserContext';

interface ShowPaymentMethodProps {
  onPaymentMethodChange?: () => void;
}

const ShowPaymentMethod = ({
  onPaymentMethodChange,
}: ShowPaymentMethodProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { currentUser } = useUser();

  const fetchPaymentMethods = async () => {
    if (!currentUser?._id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getPaymentMethods(currentUser._id);
      setPaymentMethods(response.paymentMethods);
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      setError(error.message || 'Failed to fetch payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [currentUser?._id]);

  const handleSetDefault = async (paymentMethodId: string) => {
    if (!currentUser?._id) return;

    try {
      setActionLoading(paymentMethodId);
      setError(null);

      await setDefaultPaymentMethod(currentUser._id, paymentMethodId);

      // Update local state
      setPaymentMethods((prev) =>
        prev.map((pm) => ({
          ...pm,
          isDefault: pm.id === paymentMethodId,
        })),
      );

      onPaymentMethodChange?.();
    } catch (error: any) {
      console.error('Error setting default payment method:', error);
      setError(error.message || 'Failed to set default payment method');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (!currentUser?._id) return;

    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      setActionLoading(paymentMethodId);
      setError(null);

      await deletePaymentMethod(currentUser._id, paymentMethodId);

      // Update local state
      setPaymentMethods((prev) =>
        prev.filter((pm) => pm.id !== paymentMethodId),
      );

      onPaymentMethodChange?.();
    } catch (error: any) {
      console.error('Error deleting payment method:', error);
      setError(error.message || 'Failed to delete payment method');
    } finally {
      setActionLoading(null);
    }
  };

  const getCardBrandColor = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return 'text-blue-600';
      case 'mastercard':
        return 'text-red-600';
      case 'amex':
        return 'text-green-600';
      case 'discover':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  if (!currentUser) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">
              Please login to view payment methods.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 border border-red-300 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading payment methods...</span>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No payment methods found</p>
            <p className="text-sm text-gray-400">
              Add a payment method to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((paymentMethod) => (
              <div
                key={paymentMethod.id}
                className={`p-4 border rounded-lg ${
                  paymentMethod.isDefault
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${getCardBrandColor(
                            paymentMethod.card?.brand || '',
                          )}`}
                        >
                          {formatCardBrand(paymentMethod.card?.brand || '')}
                        </span>
                        <span className="text-gray-600">
                          •••• {paymentMethod.card?.last4}
                        </span>
                        {paymentMethod.isDefault && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            <Star className="h-3 w-3 fill-current" />
                            Default
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires {paymentMethod.card?.exp_month}/
                        {paymentMethod.card?.exp_year}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!paymentMethod.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(paymentMethod.id)}
                        disabled={actionLoading === paymentMethod.id}
                        className="text-xs"
                      >
                        {actionLoading === paymentMethod.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <StarOff className="h-3 w-3" />
                        )}
                        <span className="ml-1 hidden sm:inline">
                          Set Default
                        </span>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(paymentMethod.id)}
                      disabled={actionLoading === paymentMethod.id}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {actionLoading === paymentMethod.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShowPaymentMethod;
