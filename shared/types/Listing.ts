export interface Listing {
  userId: string; // now using ObjectId
  title: string;
  locationType: 'home' | 'res' | 'either';
  locationId: string; // now using default _id from Location
  interestTopic?: string[];
  time?: Date;
  cuisine: string[];
  dietary: string[];
  numGuests?: number;
  additionalInfo: string;
  status: 'pending' | 'waiting' | 'approved';
}
