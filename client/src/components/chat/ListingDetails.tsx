import { ListingDetails as Listing } from '../../../../shared/types/ListingDetails';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Utensils, 
  Heart, 
  Clock,
  Tag,
  Info
} from 'lucide-react';

interface ListingDetailsProps {
  listing: Listing;
  onClose?: () => void;
}

const ListingDetails = ({ listing, onClose }: ListingDetailsProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className='max-w-96 border-l bg-background flex flex-col h-full flex-1'>
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b">
        <h1 className="text-lg font-bold">Experience Details</h1>
        {onClose && (
          <button 
            onClick={onClose}
            className='hover:bg-muted p-2.5 rounded-full transition-colors'
            title="Close experience details"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main Image */}
        {listing.images && listing.images.length > 0 && (
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <img 
              src={listing.images[0]} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title and Status */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{listing.title}</h2>
          <Badge variant={listing.status === 'waiting' ? 'secondary' : 'default'}>
            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
          </Badge>
        </div>

        {/* Essential Information Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Experience Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <p className="text-sm text-muted-foreground">{listing.description}</p>
            </div>
            
            {/* Date & Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Date & Time</span>
              </div>
              <div className="ml-6 space-y-1">
                <p className="text-sm">{formatDate(listing.time)}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(listing.time)}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <div className="ml-6 space-y-1">
                <p className="text-sm">{listing.locationId.address}</p>
                <p className="text-sm text-muted-foreground">
                  {listing.locationId.city}, {listing.locationId.state} {listing.locationId.zipCode}
                </p>
                <p className="text-xs text-muted-foreground">{listing.locationId.country}</p>
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Guests</span>
              </div>
              <div className="ml-6">
                <p className="text-sm">{listing.numGuests} {listing.numGuests === 1 ? 'guest' : 'guests'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Category */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Category</span>
              <div>
                <Badge variant="outline">
                  {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Cuisine */}
            {listing.cuisine && listing.cuisine.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Cuisine</span>
                </div>
                <div className="ml-6">
                  <div className="flex flex-wrap gap-1">
                    {listing.cuisine.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Dietary Restrictions */}
            {listing.dietary && listing.dietary.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Dietary</span>
                </div>
                <div className="ml-6">
                  <div className="flex flex-wrap gap-1">
                    {listing.dietary.map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Interest Topics */}
            {listing.interestTopic && listing.interestTopic.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Interests</span>
                </div>
                <div className="ml-6">
                  <div className="flex flex-wrap gap-1">
                    {listing.interestTopic.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {listing.additionalInfo && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Additional Notes</span>
                </div>
                <div className="ml-6">
                  <p className="text-sm text-muted-foreground">{listing.additionalInfo}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ListingDetails;