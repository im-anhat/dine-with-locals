import { MapPin, Clock, Users, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Listing } from '../../../../shared/types/Listing'; // Adjust the import path as necessary

interface DetailCardProps {
  listing: Listing | null;
  loading: boolean;
}

const DetailCard = ({ listing, loading }: DetailCardProps) => {
  if (loading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6 lg:ml-10">
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
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              No image available
            </div>
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
                {listing?.locationId && typeof listing.locationId === 'object'
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
            <Users className="h-5 w-5 mt-0.5" />
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
                {listing?.interestTopic && listing.interestTopic.length > 0 ? (
                  listing.interestTopic.map((topic: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">No tags available</span>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Price Details</h3>
            <div className="flex justify-between items-center">
              <span className="text-md font-semibold">
                Contact host for pricing
              </span>
            </div>
            <Button variant="link" className="p-0 h-auto text-gray-600">
              Price breakdown
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailCard;
