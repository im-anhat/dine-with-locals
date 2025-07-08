import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { Listing, listingRequiresPayment } from '../../../shared/types/Listing';
import {
  checkExistingBooking,
  getListingById,
  createBookingRequest,
} from '@/services/BookingService';
import {
  BookingFormValues,
  bookingFormSchema,
} from '@/components/booking/FormSchema';
import BookingCard from '@/components/booking/BookingCard';
import DetailCard from '@/components/booking/DetailCard';
import AddPaymentMethod from '@/components/payment/AddPaymentMethod';
import {
  getPaymentMethods,
  createBookingPaymentIntent,
} from '@/services/PaymentService';
const BookingConfirm = () => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingExists, setBookingExists] = useState(false);
  const [showPaymentSetup, setShowPaymentSetup] = useState(false);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const { currentUser } = useUser();
  const { listingId } = useParams();
  const navigate = useNavigate();

  // Determine if this listing requires payment
  const requiresPayment = listing ? listingRequiresPayment(listing) : false;

  // Check if user has payment methods only if listing requires payment
  useEffect(() => {
    const checkPaymentMethods = async () => {
      if (!currentUser?._id || !requiresPayment) {
        setHasPaymentMethod(true); // Allow booking for free listings
        return;
      }

      try {
        const { paymentMethods } = await getPaymentMethods(currentUser._id);
        setHasPaymentMethod(paymentMethods && paymentMethods.length > 0);
      } catch (error) {
        console.error('Error checking payment methods:', error);
        setHasPaymentMethod(false);
      }
    };

    checkPaymentMethods();
  }, [currentUser?._id, requiresPayment]);

  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!listingId || !currentUser?._id) return;
      try {
        const result = await checkExistingBooking(currentUser._id, listingId);
        if (result && result.hasMatch) {
          // Booking already exists, show dialog instead of alert
          setBookingExists(true);
        }
      } catch (error) {
        console.error('Error checking existing booking:', error);
      }
    };

    const fetchListingData = async () => {
      if (!listingId) return;
      try {
        setLoading(true);
        const listingData = await getListingById(listingId);
        setListing(listingData);
        console.log('Fetched listing:', listingData);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };
    checkBookingStatus();
    if (!bookingExists) {
      fetchListingData();
    }
  }, [listingId]);

  const form = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      hostId: listing?.userId._id || '',
      guestId: currentUser?._id || '',
      listingId: listingId || '',
      status: 'pending',
      additionalDetails: '',
      hostInfo: '',
    },
  });

  const handleBookingConfirm = async (values: BookingFormValues) => {
    // Check if user has payment method before proceeding (only for paid listings)
    if (requiresPayment && !hasPaymentMethod) {
      setShowPaymentSetup(true);
      return;
    }

    if (!listing?.userId._id || !currentUser?._id || !listingId) {
      console.error('Missing required booking information');
      return;
    }

    const bookingData: BookingFormValues = {
      hostId: listing.userId._id,
      guestId: currentUser._id,
      listingId: values.listingId,
      status: 'pending',
      additionalDetails: values.additionalDetails,
      hostInfo: values.hostInfo,
    };

    try {
      setLoading(true);

      // Create the booking/match first
      const response = await createBookingRequest(bookingData);
      console.log('Booking confirmed:', response);

      // If this is a paid listing, create a payment intent and attach it to the match
      if (requiresPayment && response.match?._id) {
        try {
          const paymentIntentResponse = await createBookingPaymentIntent(
            currentUser._id,
            listingId,
            response.match._id,
          );
          console.log(
            'Payment intent created and attached to match:',
            paymentIntentResponse,
          );
        } catch (paymentError) {
          console.error('Error creating payment intent:', paymentError);
        }
      }

      setBookingSuccess(true);
    } catch (error) {
      console.error('Error confirming booking:', error);
    } finally {
      setLoading(false);
    }

    form.reset({
      hostId: listing?.userId._id || '',
      guestId: currentUser?._id || '',
      listingId: listingId || '',
      status: 'pending',
      additionalDetails: '',
      hostInfo: '',
    });
  };

  const handlePaymentMethodAdded = () => {
    setHasPaymentMethod(true);
    setShowPaymentSetup(false);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Confirm Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left Column */}
          <BookingCard
            form={form}
            onSubmitForm={handleBookingConfirm}
            disabled={loading || (requiresPayment && !hasPaymentMethod)}
            requiresPayment={requiresPayment}
            hasPaymentMethod={hasPaymentMethod}
          />

          {/* Right Column */}
          <DetailCard listing={listing} loading={loading} />
        </div>
      </div>

      {/* Payment Setup Dialog - Only show for paid listings */}
      {requiresPayment && (
        <Dialog open={showPaymentSetup} onOpenChange={setShowPaymentSetup}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                This experience requires payment. Please add a payment method to
                continue with your booking.
              </DialogDescription>
            </DialogHeader>
            <AddPaymentMethod
              onSuccess={handlePaymentMethodAdded}
              onCancel={() => setShowPaymentSetup(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Success Dialog */}
      <Dialog
        open={bookingSuccess}
        onOpenChange={(open) => {
          if (!open) {
            setBookingSuccess(false);
            navigate('/filter');
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              <CheckCircle className="mx-auto mb-2 h-10 w-10 text-green-600" />
              Booking Requested
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Your booking request has been sent to the host. You will be notified
            once the host accepts or declines your request.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => {
                setBookingSuccess(false);
                navigate('/dashboard');
              }}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Already Exists Dialog */}
      <Dialog
        open={bookingExists}
        onOpenChange={(open) => {
          if (!open) {
            setBookingExists(false);
            navigate('/filter');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Booking Already Exists
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You have already requested a booking for this experience. You can
            check the status in your dashboard.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => {
                setBookingExists(false);
                navigate('/filter');
              }}
              className="w-full"
            >
              Back to Experiences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingConfirm;
