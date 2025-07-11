import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField } from '@/components/ui/form';
import { CreditCard, Plus, Loader2, CheckCircle, Star } from 'lucide-react';
import { BookingFormValues } from '@/components/booking/FormSchema';
import AddPaymentMethod from '@/components/payment/AddPaymentMethod';
import {
  getPaymentMethods,
  setDefaultPaymentMethod,
  type PaymentMethod,
} from '@/services/PaymentService';
import { useUser } from '@/contexts/UserContext';

interface BookingCardProps {
  form: UseFormReturn<BookingFormValues>;
  onSubmitForm: (values: BookingFormValues) => void;
  disabled?: boolean;
  requiresPayment?: boolean;
  hasPaymentMethod?: boolean;
  onPaymentMethodAdded?: () => void;
}

const BookingCard = ({
  form,
  onSubmitForm,
  disabled,
  requiresPayment = false,
  hasPaymentMethod = false,
  onPaymentMethodAdded,
}: BookingCardProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('');
  const [settingDefault, setSettingDefault] = useState<string>('');
  const { currentUser } = useUser();

  // Fetch payment methods only if payment is required
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!currentUser?._id || !requiresPayment) {
        setIsLoadingPayments(false);
        return;
      }

      try {
        const response = await getPaymentMethods(currentUser._id);
        setPaymentMethods(response.paymentMethods);

        // Set the selected payment method to the default one
        const defaultMethod = response.paymentMethods.find(
          (pm) => pm.isDefault,
        );
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      } finally {
        setIsLoadingPayments(false);
      }
    };

    fetchPaymentMethods();
  }, [currentUser?._id, requiresPayment]);

  const handlePaymentMethodAdded = async () => {
    setShowAddPayment(false);
    // Refresh payment methods
    if (currentUser?._id) {
      try {
        const response = await getPaymentMethods(currentUser._id);
        setPaymentMethods(response.paymentMethods);

        // If this is the first payment method, select it
        if (response.paymentMethods.length === 1) {
          setSelectedPaymentMethod(response.paymentMethods[0].id);
        }

        // Notify parent component that a payment method was added
        onPaymentMethodAdded?.();
      } catch (error) {
        console.error('Error refreshing payment methods:', error);
      }
    }
  };

  const handleSetAsDefault = async (paymentMethodId: string) => {
    if (!currentUser?._id) return;

    try {
      setSettingDefault(paymentMethodId);
      await setDefaultPaymentMethod(currentUser._id, paymentMethodId);

      // Update local state
      setPaymentMethods((prev) =>
        prev.map((pm) => ({
          ...pm,
          isDefault: pm.id === paymentMethodId,
        })),
      );

      setSelectedPaymentMethod(paymentMethodId);
    } catch (error) {
      console.error('Error setting default payment method:', error);
    } finally {
      setSettingDefault('');
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

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
          {/* Additional Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Additional details for the host</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <Textarea
                    placeholder="E.g. Number of people in your trip, expected time of arrival, dietary restrictions, etc."
                    className="resize-none"
                    {...field}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Host Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>What your host should know</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="hostInfo"
                render={({ field }) => (
                  <Textarea
                    placeholder="Share any important information your host should know"
                    className="resize-none"
                    {...field}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Payment Method Card - Only show if payment is required */}
          {requiresPayment && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingPayments ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading payment methods...</span>
                  </div>
                ) : showAddPayment ? (
                  <AddPaymentMethod
                    onSuccess={handlePaymentMethodAdded}
                    onCancel={() => setShowAddPayment(false)}
                  />
                ) : paymentMethods.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {paymentMethods.map((paymentMethod) => (
                        <div
                          key={paymentMethod.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedPaymentMethod === paymentMethod.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() =>
                            setSelectedPaymentMethod(paymentMethod.id)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name="paymentMethod"
                                  value={paymentMethod.id}
                                  checked={
                                    selectedPaymentMethod === paymentMethod.id
                                  }
                                  onChange={() =>
                                    setSelectedPaymentMethod(paymentMethod.id)
                                  }
                                  className="mr-3"
                                />
                                <CreditCard className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-medium ${getCardBrandColor(
                                      paymentMethod.card?.brand || '',
                                    )}`}
                                  >
                                    {formatCardBrand(
                                      paymentMethod.card?.brand || '',
                                    )}
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

                            {!paymentMethod.isDefault && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetAsDefault(paymentMethod.id);
                                }}
                                disabled={settingDefault === paymentMethod.id}
                                className="text-xs"
                              >
                                {settingDefault === paymentMethod.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  'Set as Default'
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowAddPayment(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add new card
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center py-4">
                      <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">
                        No payment methods found
                      </p>
                      <p className="text-sm text-gray-400">
                        Add a payment method to continue
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      className="w-full"
                      onClick={() => setShowAddPayment(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add payment method
                    </Button>
                  </>
                )}

                {!showAddPayment && paymentMethods.length > 0 && (
                  <p className="text-gray-600 text-sm">
                    We will not charge until the experience has happened. If the
                    host declines your request, no charge will occur.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Free Experience Notice */}
          {!requiresPayment && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">
                      Free Experience
                    </p>
                    <p className="text-green-700 text-sm">
                      No payment required for this experience
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notice Card */}
          <Card>
            <CardHeader>
              <CardTitle>Notice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                By clicking "Request", the host can view your information. It
                does not guarantee the experience unless the host approved your
                request. The host can reject your request.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked === true)}
                />
                <label htmlFor="confirm" className="font-medium">
                  I confirm the above
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Request Button */}
          <Button
            className="w-full h-12 text-lg"
            disabled={
              !confirmed ||
              disabled ||
              (requiresPayment && (!hasPaymentMethod || !selectedPaymentMethod))
            }
            type="submit"
            onClick={() => {
              if (!confirmed) {
                alert('Please confirm the details before proceeding.');
              } else if (requiresPayment && !hasPaymentMethod) {
                alert('Please add a payment method before proceeding.');
              } else if (requiresPayment && !selectedPaymentMethod) {
                alert('Please select a payment method before proceeding.');
              }
            }}
          >
            Request to Book
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BookingCard;
