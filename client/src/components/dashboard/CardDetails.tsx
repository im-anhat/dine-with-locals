import {
  MapPin,
  Clock,
  Users,
  ChefHat,
  Calendar,
  Phone,
  User,
} from 'lucide-react';
import { useLocation } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'waiting':
      return 'bg-brand-orange-100 text-brand-orange-800 border-brand-orange-300';
    case 'confirmed':
      return 'bg-brand-teal-100 text-brand-teal-800 border-brand-teal-300';
    case 'cancelled':
      return 'bg-brand-coral-100 text-brand-coral-800 border-brand-coral-300';
    default:
      return 'bg-brand-shell-200 text-brand-stone-800 border-brand-stone-300';
  }
};

type InfoBadgeProps = {
  icon: React.ElementType;
  label: string;
  value: string | number;
};

const InfoBadge = ({ icon: Icon, label, value }: InfoBadgeProps) => (
  <div className="flex items-center gap-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="font-semibold text-white text-lg">{value}</p>
      <p className="text-white/80 text-sm">{label}</p>
    </div>
  </div>
);

type DetailSectionProps = {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

const DetailSection = ({
  icon: Icon,
  title,
  children,
  iconBg,
  iconColor,
}: DetailSectionProps) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-shell-200 hover:shadow-2xl transition-shadow duration-300">
    <div className="flex items-center gap-4 mb-6">
      <div
        className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-md`}
      >
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h2 className="text-2xl font-bold text-brand-stone-900">{title}</h2>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

type TagGroupProps = {
  title: string;
  tags: string[];
  bg: string;
  text: string;
};

const TagGroup = ({ title, tags, bg, text }: TagGroupProps) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-shell-200">
    <h2 className="text-2xl font-bold text-brand-stone-900 mb-6">{title}</h2>
    <div className="flex flex-wrap gap-3">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className={`px-5 py-2 ${bg} ${text} rounded-full font-semibold capitalize hover:scale-105 transition-transform duration-200 shadow-sm`}
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const CardDetails = () => {
  const location = useLocation();
  const content = location.state?.content || {
    title: 'Culinary Experience',
    status: 'confirmed',
    images: [],
    cuisine: ['Italian', 'Mediterranean'],
    description:
      'Join us for an unforgettable culinary journey featuring authentic flavors and exceptional hospitality.',
    numGuests: 8,
    duration: 3,
    time: '2024-12-15T19:00:00',
    locationId: {
      address: '123 Culinary Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States',
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    userId: {
      firstName: 'Chef',
      lastName: 'Rodriguez',
      userName: 'chef_rodriguez',
      phone: '+1 (555) 123-4567',
    },
    interestTopic: ['Food & Wine', 'Travel Stories', 'Local Culture'],
    dietary: ['Vegetarian Options', 'Gluten-Free Available'],
  };
  console.log('content.userId.role', content.userId.role);
  const datetime = formatDate(content.time);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-orange-50 via-brand-shell-200 to-brand-coral-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative px-6 py-12 max-w-7xl mx-auto">
          {/* Status Badge */}
          <div className="flex justify-end mb-4">
            <span
              className={`px-6 py-2 rounded-full text-sm font-semibold ${getStatusColor(content.status)}`}
            >
              {content.status}
            </span>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-bold text-brand-stone-900 mb-8 leading-tight">
            {content.title}
          </h1>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-1 space-y-8">
              {/* Cuisine Tags */}
              {content.cuisine?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {content.cuisine.map((c: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-brand-orange-100 text-brand-orange-800 rounded-full text-sm font-semibold border border-brand-orange-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {content.description && (
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-brand-shell-200">
                  <p className="text-brand-stone-700 text-xl leading-relaxed">
                    {content.description}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              {content.additionalInfo && (
                <div className="bg-brand-teal-50 border-l-4 border-brand-teal-400 rounded-r-2xl p-6 shadow-lg">
                  <p className="text-brand-teal-800 font-semibold text-lg mb-2">
                    Additional Information
                  </p>
                  <p className="text-brand-teal-700 text-lg">
                    {content.additionalInfo}
                  </p>
                </div>
              )}
            </div>

            {/* Event Details Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-brand-orange-500 to-brand-coral-600 text-white rounded-2xl p-8 shadow-2xl sticky top-8">
                <h3 className="text-2xl font-bold mb-6">
                  {content.category} Details
                </h3>
                <div className="space-y-4">
                  <InfoBadge
                    icon={Calendar}
                    label="Date & Time"
                    value={`${datetime.date} • ${datetime.time}`}
                  />
                  <InfoBadge
                    icon={Users}
                    label="Expected attendance"
                    value={`${content.numGuests} Guest${content.numGuests !== 1 ? 's' : ''}`}
                  />
                  <InfoBadge
                    icon={Clock}
                    label="Duration"
                    value={`${content.duration} Hour${content.duration !== 1 ? 's' : ''}`}
                  />
                </div>

                {/* Book Now Button */}
                <button className="w-full mt-8 bg-white text-brand-orange-600 py-4 px-8 rounded-xl font-bold text-lg hover:bg-brand-orange-50 transition-all duration-200 shadow-lg">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Location & Host */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <DetailSection
            icon={MapPin}
            title="Location"
            iconBg="bg-brand-coral-100"
            iconColor="text-brand-coral-600"
          >
            <div className="space-y-3">
              <p className="text-brand-stone-900 font-semibold text-lg">
                {content.locationId.address}
              </p>
              <p className="text-brand-stone-600 text-lg">
                {content.locationId.city}, {content.locationId.state}{' '}
                {content.locationId.zipCode}
              </p>
              <p className="text-brand-stone-600 text-lg">
                {content.locationId.country}
              </p>
            </div>
            {content.locationId.coordinates && (
              <div className="pt-4 border-t border-brand-shell-200">
                <p className="text-sm text-brand-stone-500 mb-2 font-medium">
                  Coordinates
                </p>
                <p className="text-sm font-mono text-brand-stone-700 bg-brand-shell-100 p-2 rounded-lg">
                  {content.locationId.coordinates.lat},{' '}
                  {content.locationId.coordinates.lng}
                </p>
              </div>
            )}
          </DetailSection>

          <DetailSection
            icon={User}
            title={content.userId.role}
            iconBg="bg-brand-teal-100"
            iconColor="text-brand-teal-600"
          >
            <div className="space-y-4">
              <div>
                <p className="text-brand-stone-900 font-semibold text-xl">
                  {content.userId.firstName} {content.userId.lastName}
                </p>
                <p className="text-brand-stone-600 text-lg">
                  @{content.userId.userName}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-brand-shell-100 p-3 rounded-lg">
                <Phone className="w-5 h-5 text-brand-stone-500" />
                <p className="text-brand-stone-700 font-medium">
                  {content.userId.phone}
                </p>
              </div>
            </div>
          </DetailSection>
        </div>

        {/* Tags Sections */}
        <div className="space-y-8">
          {content.interestTopic?.length > 0 && (
            <TagGroup
              title="Conversation Topics"
              tags={content.interestTopic}
              bg="bg-brand-orange-100"
              text="text-brand-orange-800"
            />
          )}

          {content.dietary?.length > 0 && (
            <TagGroup
              title="Dietary Considerations"
              tags={content.dietary}
              bg="bg-brand-teal-100"
              text="text-brand-teal-800"
            />
          )}
        </div>
      </div>

      {content.images && (
        <div className="flex flex-col items-center justify-center px-16">
          <Carousel>
            <CarouselContent>
              {(content.images || []).length ? (
                content.images.map((image: string, i: number) => (
                  <CarouselItem key={i} className="w-full md:w-2/3 lg:w-1/2">
                    <img
                      src={image}
                      alt={`${content.title} - Image ${i + 1}`}
                      className="w-full h-80 md:h-96 object-cover rounded-lg shadow-lg transition-transform duration-500"
                    />
                  </CarouselItem>
                ))
              ) : (
                <div className="w-full h-80 md:h-96 bg-gradient-to-br from-brand-orange-500 to-brand-coral-600 flex items-center justify-center rounded-lg shadow-lg">
                  <ChefHat className="w-24 h-24 text-white" />
                </div>
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="sr-only">Previous</span>
              &lt;
            </CarouselPrevious>
            <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
              <span className="sr-only">Next</span>
              &gt;
            </CarouselNext>
          </Carousel>
          <div className="flex space-x-2 mt-4">
            {(content.images || []).map((_: any, index: number) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-brand-orange-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardDetails;
