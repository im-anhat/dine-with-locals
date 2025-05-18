import React, { useState, useEffect } from 'react';

interface PlaceRecommendationProps {
  location: { lat: number; lng: number };
  isHost: boolean;
}

interface Listing {
  id: string;
  title: string;
  location: { lat: number; lng: number };
  hostName: string;
  cuisine: string[];
  price: string;
  rating: number;
  reviews: number;
  image: string;
}

// Mock data for listings in New York
const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Authentic Vietnamese Dinner',
    location: { lat: 40.7128, lng: -74.006 },
    hostName: 'Pho Ly quoc su',
    cuisine: ['Vietnamese', 'Asian', 'Local'],
    price: '$3 - $10',
    rating: 4.2,
    reviews: 1546,
    image:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
  },
  {
    id: '2',
    title: 'Homemade Italian Feast',
    location: { lat: 40.7282, lng: -73.9942 },
    hostName: 'Mario Romano',
    cuisine: ['Italian', 'Mediterranean'],
    price: '$15 - $25',
    rating: 4.8,
    reviews: 123,
    image:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
  },
  {
    id: '3',
    title: 'Fusion Japanese Experience',
    location: { lat: 40.7589, lng: -73.9851 },
    hostName: 'Kenji Tanaka',
    cuisine: ['Japanese', 'Fusion'],
    price: '$20 - $40',
    rating: 4.6,
    reviews: 89,
    image:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
  },
  {
    id: '4',
    title: 'Southern Comfort Food',
    location: { lat: 40.7392, lng: -74.0089 },
    hostName: 'Sarah Johnson',
    cuisine: ['American', 'Southern'],
    price: '$10 - $20',
    rating: 4.4,
    reviews: 56,
    image:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
  },
];

// Mock data for guest requests
const mockRequests = [
  {
    id: '1',
    title: 'Looking for Local BBQ',
    location: { lat: 40.7128, lng: -74.006 },
    guestName: 'Mike Chen',
    cuisine: ['American', 'BBQ'],
    date: '2023-06-15',
    guests: 2,
    price: '$10 - $20',
    image:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
  },
  {
    id: '2',
    title: 'Seeking Authentic Chinese',
    location: { lat: 40.7159, lng: -73.9877 },
    guestName: 'Emma Watson',
    cuisine: ['Chinese', 'Asian'],
    date: '2023-06-18',
    guests: 3,
    price: '$15 - $25',
    image:
      'https://a0.anyrgb.com/pngimg/1146/1162/gulpjs-foreach-loop-shuriken-study-skills-computer-programming-github-computer-security-ninja-knowledge-avatar.png',
  },
];

const PlaceRecommendations: React.FC<PlaceRecommendationProps> = ({
  location,
  isHost,
}) => {
  const [filter, setFilter] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Listing[]>([]);

  useEffect(() => {
    // In a real app, you would fetch data from your API based on location and filters
    // For now, we'll use mock data
    setRecommendations(mockListings);
  }, [location]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);

    // In a real app, you would fetch filtered data from your API
    // For now, we'll just simulate filtering
    if (newFilter) {
      const filtered = mockListings.filter(
        (listing) =>
          listing.cuisine.some((c) =>
            c.toLowerCase().includes(newFilter.toLowerCase()),
          ) ||
          listing.title.toLowerCase().includes(newFilter.toLowerCase()) ||
          listing.hostName.toLowerCase().includes(newFilter.toLowerCase()),
      );
      setRecommendations(filtered);
    } else {
      setRecommendations(mockListings);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-semibold mb-4">
          {isHost ? 'Guest Requests' : 'Recommended'}
        </h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Filter by cuisine or name..."
            className="w-full p-2 border rounded"
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {isHost
          ? // Display requests for hosts
            mockRequests.map((request) => (
              <div key={request.id} className="p-4 border-b hover:bg-gray-50">
                <div className="flex items-center">
                  <img
                    src={request.image}
                    alt={request.guestName}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{request.title}</h3>
                    <p className="text-sm text-gray-600">{request.guestName}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">Date: {request.date}</p>
                  <p className="text-sm">Guests: {request.guests}</p>
                  <p className="text-sm">
                    Cuisines: {request.cuisine.join(', ')}
                  </p>
                  <p className="text-sm">Budget: {request.price}</p>
                </div>
                <button className="mt-3 px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">
                  Invite Guest
                </button>
              </div>
            ))
          : // Display listings for guests
            recommendations.map((listing) => (
              <div key={listing.id} className="p-4 border-b hover:bg-gray-50">
                <div className="flex items-center">
                  <img
                    src={listing.image}
                    alt={listing.hostName}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{listing.title}</h3>
                    <p className="text-sm text-gray-600">{listing.hostName}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className="mr-2">{renderStars(listing.rating)}</div>
                    <span className="text-sm text-gray-600">
                      ({listing.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-sm">
                    Cuisines: {listing.cuisine.join(', ')}
                  </p>
                  <p className="text-sm">Price: {listing.price}</p>
                </div>
                <button className="mt-3 px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700">
                  Book Experience
                </button>
              </div>
            ))}
      </div>
    </div>
  );
};

export default PlaceRecommendations;
