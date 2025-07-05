// Location interface for populated locationId
export interface PopulatedLocation {
  _id: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Listing {
  _id: string;
  userId: {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  title: string;
  description: string;
  images?: string[];
  category: 'dining' | 'travel' | 'event';
  locationId: string | PopulatedLocation; // Can be either string ID or populated object
  additionalInfo?: string;
  status: 'pending' | 'waiting' | 'approved';
  time?: Date;
  duration?: number;
  interestTopic?: string[];
  numGuests?: number;
}