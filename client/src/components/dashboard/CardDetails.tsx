import {
  MapPin,
  Clock,
  Users,
  ChefHat,
  Calendar,
  Phone,
  User,
  ArrowLeft,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

const CardDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = location.state?.content || {};

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <div className="flex items-center gap-4 p-6 border-b bg-white sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">
          {content.title || 'Request Details'}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* About This Request */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Additional details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  About This Request
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {content.description ||
                    content.additionalInfo ||
                    'No description provided.'}
                </p>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Location
                </h2>
                <p className="text-gray-600">
                  {typeof content.locationId === 'string'
                    ? content.locationId
                    : content.locationId?.address
                      ? `${content.locationId.address}, ${content.locationId.city || ''}, ${content.locationId.state || ''}, ${content.locationId.country || ''}, ${content.locationId.zipCode || ''}`
                      : 'Location not specified'}
                </p>
              </div>

              {/* What to Expect */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  What to Expect
                </h2>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Looking for a host for this request,{' '}
                      {content.userId?.firstName} {content.userId?.lastName}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      Location type preference:{' '}
                      {content.category || 'Restaurant'}
                    </span>
                  </div>
                  {content.cuisine && content.cuisine.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Cuisine interests: {content.cuisine.join(', ')}
                      </span>
                    </div>
                  )}
                  {content.dietary && content.dietary.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                      <span>
                        Dietary restrictions: {content.dietary.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {content.interestTopic && content.interestTopic.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Conversation Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {content.interestTopic.map((topic: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Images section if available */}
            {content.images && content.images.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Images
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {content.images
                    .slice(0, 6)
                    .map((image: string, idx: number) => (
                      <div key={idx} className="aspect-square">
                        <img
                          src={image}
                          alt={`Request image ${idx + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Info panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg space-y-6 sticky top-24">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                  {content.category || 'Restaurant'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Requested Time</p>
                <p className="text-base font-medium text-orange-600">
                  {formatDate(content.time)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Number of Guests</p>
                <p className="text-base font-medium text-gray-900">
                  {content.numGuests || 1}{' '}
                  {(content.numGuests || 1) === 1 ? 'person' : 'people'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Requested by</p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={content.userId?.avatar}
                      alt={content.userId?.firstName}
                    />
                    <AvatarFallback>
                      {content.userId?.firstName?.[0]}
                      {content.userId?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {content.userId?.firstName} {content.userId?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{content.userId?.userName || 'username'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <Button
                  className="w-full bg-red-400 hover:bg-red-500 text-white py-3"
                  onClick={() => {
                    // Handle offer to host action
                    console.log('Offer to host clicked');
                  }}
                >
                  Offer to Host
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-400 text-red-400 hover:bg-red-50 py-3"
                  onClick={() => {
                    // Handle contact guest action
                    console.log('Contact guest clicked');
                  }}
                >
                  Contact Guest
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
