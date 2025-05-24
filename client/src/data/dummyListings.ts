// Dummy listing data for NYC
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    lat: number;
    lng: number;
  };
  hostName: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
}

export const dummyListings: Listing[] = [
  {
    id: '1',
    title: 'Authentic Italian Dinner',
    description:
      'Experience homemade Italian cuisine prepared by Chef Maria. Enjoy pasta, antipasti, and tiramisu in a cozy setting.',
    price: 65,
    location: {
      lat: 40.73061,
      lng: -73.935242, // Manhattan, New York
    },
    hostName: 'Maria C.',
    cuisine: 'Italian',
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    title: 'Traditional Japanese Feast',
    description:
      'Join Kenji for a traditional multi-course Japanese dinner featuring seasonal ingredients and authentic recipes.',
    price: 85,
    location: {
      lat: 40.712776,
      lng: -74.005974, // Lower Manhattan, New York
    },
    hostName: 'Kenji T.',
    cuisine: 'Japanese',
    rating: 4.9,
    imageUrl:
      'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    title: 'Spanish Tapas Evening',
    description:
      'Indulge in a variety of tapas dishes paired with Spanish wines. Learn about Spanish cuisine while enjoying a social dining experience.',
    price: 55,
    location: {
      lat: 40.758896,
      lng: -73.98513, // Midtown Manhattan, New York
    },
    hostName: 'Carlos R.',
    cuisine: 'Spanish',
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '4',
    title: 'Vietnamese Home Cooking',
    description:
      'Savor the flavors of Vietnam with a family-style dinner featuring pho, spring rolls, and other traditional dishes.',
    price: 50,
    location: {
      lat: 40.741895,
      lng: -73.989308, // Chelsea, New York
    },
    hostName: 'Linh N.',
    cuisine: 'Vietnamese',
    rating: 4.6,
    imageUrl:
      'https://images.unsplash.com/photo-1576080968434-58ba25e97185?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '5',
    title: 'Farm-to-Table American',
    description:
      'Enjoy a seasonal meal prepared with locally sourced ingredients from New York farmers markets. Focus on sustainable cooking.',
    price: 70,
    location: {
      lat: 40.723118,
      lng: -73.987649, // East Village, New York
    },
    hostName: 'Sarah J.',
    cuisine: 'American',
    rating: 4.7,
    imageUrl:
      'https://images.unsplash.com/photo-1536746953245-801a7ec4037a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '6',
    title: 'Indian Vegetarian Feast',
    description:
      'Experience the rich flavors of Indian vegetarian cuisine with a multi-course dinner featuring regional specialties.',
    price: 60,
    location: {
      lat: 40.764665,
      lng: -73.977652, // Upper East Side, New York
    },
    hostName: 'Priya K.',
    cuisine: 'Indian',
    rating: 4.8,
    imageUrl:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '7',
    title: 'Greek Island Experience',
    description:
      'Transport yourself to the Greek islands with traditional mezze, grilled seafood, and homemade baklava.',
    price: 65,
    location: {
      lat: 40.703812,
      lng: -73.989723, // Brooklyn, New York (close to Manhattan)
    },
    hostName: 'Nikos P.',
    cuisine: 'Greek',
    rating: 4.6,
    imageUrl:
      'https://images.unsplash.com/photo-1566566713478-12ed1dea0578?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
  },
];
