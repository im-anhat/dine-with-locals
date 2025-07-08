export interface Match {
  _id: string;
  hostId: string;
  guestId: string;
  listingId?: string;
  requestId?: string;
  status: 'pending' | 'approved';
  paymentIntentId?: string; // Stripe Payment Intent ID
  paymentStatus?: 'pending' | 'succeeded';
  amount?: number; // Amount in cents
  currency?: string;
  additionalDetails?: string;
  hostInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Populated version when user details are included
export interface PopulatedMatch extends Omit<Match, 'hostId' | 'guestId'> {
  hostId: {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  guestId: {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}
