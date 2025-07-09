// Match type for API responses with populated fields
import type { PopulatedLocation } from './Listing';

export interface PopulatedUser {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface PopulatedListing {
  _id: string;
  title: string;
  category: string;
  locationId: PopulatedLocation;
  time: Date;
}

export interface PopulatedRequest {
  _id: string;
  title: string;
  category: string;
  locationId: PopulatedLocation;
  time: Date;
}

export interface Match {
  _id: string;
  hostId: PopulatedUser;
  guestId: PopulatedUser;
  listingId?: PopulatedListing;
  requestId?: PopulatedRequest;
  status: 'pending' | 'approved';
  additionalDetails: string;
  hostInfo: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
