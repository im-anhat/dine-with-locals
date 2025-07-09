import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { createSetupIntent, addPaymentMethod } from '@/services/PaymentService';
import { useUser } from '@/contexts/UserContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  userId: string;
}

const PaymentForm = ({ onSuccess, onError, userId }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Confirm the setup intent
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        onError(
          error.message || 'An error occurred while setting up payment method',
        );
        return;
      }

      if (setupIntent && setupIntent.payment_method) {
        // Add the payment method to our backend
        await addPaymentMethod(userId, setupIntent.payment_method as string);
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      onError('Failed to add payment method');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || isLoading}
        className="w-full"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Adding Payment Method...' : 'Add Payment Method'}
      </Button>
    </div>
  );
};

interface AddPaymentMethodProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isOptional?: boolean; // New prop to indicate if payment method is optional
}

const AddPaymentMethod = ({
  onSuccess,
  onCancel,
  isOptional = false,
}: AddPaymentMethodProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();

  useEffect(() => {
    const initializeSetupIntent = async () => {
      if (!currentUser?._id) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null); // Clear any previous errors
        const { client_secret } = await createSetupIntent(currentUser._id);
        setClientSecret(client_secret);
      } catch (error) {
        console.error('Error creating setup intent:', error);
        setError('Failed to initialize payment setup');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSetupIntent();
  }, [currentUser?._id]); // Only depend on the user ID

  const handleSuccess = () => {
    setError(null);
    onSuccess?.();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!currentUser) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">
              Please login to add payment methods.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          Add Payment Method
          {isOptional && (
            <span className="text-sm text-gray-500 font-normal ml-2">
              (Optional)
            </span>
          )}
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
            <span className="ml-2">Loading...</span>
          </div>
        ) : clientSecret ? (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: clientSecret,
              appearance: {
                theme: 'stripe' as const,
              },
            }}
          >
            <PaymentForm
              onSuccess={handleSuccess}
              onError={handleError}
              userId={currentUser._id}
            />
          </Elements>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">Failed to load payment form</p>
          </div>
        )}

        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isOptional ? 'Skip for now' : 'Cancel'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AddPaymentMethod;
