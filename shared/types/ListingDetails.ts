interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationId {
  coordinates: Coordinates;
  name: string;
  place_id: string;
  _id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ListingDetails {
  _id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  locationId: LocationId;
  additionalInfo: string;
  status: string;
  time: string;
  interestTopic: string[];
  numGuests: number;
  cuisine: string[];
  dietary: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
