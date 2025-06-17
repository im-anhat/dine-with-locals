import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Users,
  X as XIcon,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

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

const CardDetails = () => {
  const location = useLocation();
  const content = location.state?.content;

  if (!content) return null;
  const datetime = formatDate(content.time);

  return (
    <div className="flex flex-row justify-center mt-8">
      <div className="bg-white overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-brand-stone-800">
            {content.title}
          </h2>
        </div>

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-2 space-y-6 rounded-lg shadow-lg border-2 border-gray-100 w-full p-8">
            {content.description && (
              <div>
                <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                  Description
                </h3>
                <p className="text-brand-stone-600 text-base">
                  {content.description}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                Location
              </h3>
              <p className="text-brand-stone-600 text-base">
                {content.locationId?.address}, {content.locationId?.city},{' '}
                {content.locationId?.state} {content.locationId?.zipCode},{' '}
                {content.locationId?.country}
              </p>
            </div>

            {content.cuisine && content.cuisine.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                  Cuisine
                </h3>
                <div className="flex flex-wrap gap-2">
                  {content.cuisine.map((c: string, i: number) => (
                    <span
                      key={i}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {content.interestTopic && content.interestTopic.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                  Conversation Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {content.interestTopic.map((t: string, i: number) => (
                    <span
                      key={i}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {content.dietary && content.dietary.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-brand-stone-800 mb-2">
                  Dietary Considerations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {content.dietary.map((d: string, i: number) => (
                    <span
                      key={i}
                      className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-brand-shell-100 p-4 rounded-lg space-y-4 shadow-lg">
            <div>
              <h4 className="text-sm text-brand-stone-500 mb-1">Date & Time</h4>
              <p className="text-brand-orange-600 font-semibold">
                {datetime.date} • {datetime.time}
              </p>
            </div>

            <div>
              <h4 className="text-sm text-brand-stone-500 mb-1">Guests</h4>
              <p className="text-brand-stone-800">{content.numGuests} people</p>
            </div>

            <div>
              <h4 className="text-sm text-brand-stone-500 mb-1">Duration</h4>
              <p className="text-brand-stone-800">{content.duration} hours</p>
            </div>

            <div>
              <h4 className="text-sm text-brand-stone-500 mb-1">Host</h4>
              <p className="text-brand-stone-800">
                {content.userId.firstName} {content.userId.lastName}
              </p>
              <p className="text-sm text-brand-stone-600">
                @{content.userId.userName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-stone-500" />
              <p className="text-brand-stone-700 text-sm">
                {content.userId.phone}
              </p>
            </div>

            <button className="w-full bg-brand-coral-300 text-white py-2 rounded-lg font-medium hover:bg-brand-coral-500 transition">
              Book This Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
