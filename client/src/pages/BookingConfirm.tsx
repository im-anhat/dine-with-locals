import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, MapPin, Clock, Users, Tag, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField } from '@/components/ui/form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { Listing } from '../../../shared/types/Listing';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const formSchema = z.object({
  hostId: z.string(),
  guestId: z.string(),
  listingId: z.string(),
  status: z.enum(['pending']),
  additionalDetails: z.string().optional(),
  hostInfo: z.string().optional(),
});

const BookingConfirm = () => {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { currentUser } = useUser();
  const { listingId } = useParams(); // Assuming listingId is passed in state
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingBooking = async () => {
      if (!listingId || !currentUser?._id) return;
      try {
        const response = await axios.get(
          `${API_URL}/matches?userId=${currentUser._id}&listingId=${listingId}`,
        );
        if (response.data && response.data.hasMatch) {
          // Booking already exists, redirect or show a message
          alert('You have already requested a booking for this experience.');
          navigate('/dashboard'); // Or any other page
        }
      } catch (error) {
        console.error('Error checking existing booking:', error);
      }
    };

    const fetchListingData = async () => {
      if (!listingId) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/listing/${listingId}`);
        setListing(response.data);
        console.log('Fetched listing:', response.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListingData();
    checkExistingBooking();
  }, [listingId, currentUser]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hostId: listing?.userId._id || '',
      guestId: currentUser?._id || '',
      listingId: listingId || '',
      status: 'pending',
      additionalDetails: '',
      hostInfo: '',
    },
  });

  const handleBookingConfirm = async (values: z.infer<typeof formSchema>) => {
    const bookingData = {
      hostId: listing?.userId._id,
      guestId: currentUser?._id,
      listingId: values.listingId,
      status: values.status,
      additionalDetails: values.additionalDetails,
      hostInfo: values.hostInfo,
    };

    try {
      const response = await axios.post(`${API_URL}/matches`, bookingData);
      console.log('Booking confirmed:', response.data);
      setBookingSuccess(true);
    } catch (error) {
      console.error('Error confirming booking:', error);
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
          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleBookingConfirm)}
                className="space-y-8"
              >
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

                {/* Payment Method Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        <div>
                          <p className="font-medium">American Express</p>
                          <p className="text-gray-500">Ends in 6677</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      + Add new card
                    </Button>
                    <p className="text-gray-600">
                      We will not charge until the experience has happened. If
                      the host declines your request, no charge will occur.
                    </p>
                  </CardContent>
                </Card>

                {/* Notice Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notice</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      By clicking "Request", the host can view your information.
                      It does not guarantee the experience unless the host
                      approved your request. The host can reject your request.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="confirm"
                        checked={confirmed}
                        onCheckedChange={(checked) =>
                          setConfirmed(checked === true)
                        }
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
                  disabled={!confirmed}
                  type="submit"
                  onClick={() => {
                    if (!confirmed) {
                      alert('Please confirm the details before proceeding.');
                    }
                    handleBookingConfirm(form.getValues());
                  }}
                >
                  Request to Book
                </Button>
              </form>
            </Form>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:ml-10">
            {loading ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gray-200 rounded-t-lg animate-pulse"></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <>
                {/* Listing Image */}
                <Card>
                  <CardContent className="p-0">
                    {listing?.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="aspect-video w-full object-cover rounded-lg"
                      />
                    ) : (
                      <></>
                    )}
                  </CardContent>
                </Card>

                {/* Booking Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {listing?.title || 'Loading...'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5" />
                      <div>
                        <p className="text-md">
                          {listing?.locationId &&
                          typeof listing.locationId === 'object'
                            ? `${listing.locationId.address}, ${listing.locationId.city}, ${listing.locationId.state ? listing.locationId.state + ', ' : ''}${listing.locationId.country}`
                            : 'Location not available'}
                        </p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 mt-0.5" />
                      <div>
                        <p>
                          {listing?.time
                            ? new Date(listing.time).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : 'Time not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5mt-0.5" />
                      <div>
                        <p>
                          {listing?.numGuests
                            ? `${listing.numGuests} guests`
                            : 'Guest count not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-start gap-3">
                      <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {listing?.interestTopic &&
                          listing.interestTopic.length > 0 ? (
                            listing.interestTopic.map((topic, index) => (
                              <Badge key={index} variant="secondary">
                                {topic}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">
                              No tags available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Price Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Price Details
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-md font-semibold">
                          Contact host for pricing
                        </span>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-gray-600"
                      >
                        Price breakdown
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={bookingSuccess} onOpenChange={setBookingSuccess}>
        <DialogContent className="sm:max-w-[425px]">
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
    </div>
  );
};

export default BookingConfirm;
