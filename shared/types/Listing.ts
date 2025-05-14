export interface Listing {
  _id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  category: 'Dining' | 'Travel' | 'Event';
  locationId: string;
  interestTopic?: string[];
  time?: Date;
  duration?: number;
  cuisine: string[];
  dietary: string[];
  numGuests?: number;
  additionalInfo: string;
  status: 'pending' | 'waiting' | 'approved';
}