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

export interface Request {
  _id: string;
  userId: {
    userName: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: Date;
  title: string;
  locationType: 'home' | 'res' | 'either';
  locationId: string | PopulatedLocation; // Can be either string ID or populated object
  interestTopic: string[];
  time: Date;
  cuisine: string[];
  dietaryRestriction: string[];
  numGuests: number;
  additionalInfo: string;
  status: 'waiting' | 'pending' | 'approved';
}
