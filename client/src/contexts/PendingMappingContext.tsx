import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../../../shared/types/User';
import { ListingDetails } from '../../../shared/types/ListingDetails';
import { useEffect } from 'react';
import { useUser } from './UserContext';
import {
  getListingsByUserId,
  getMatchesFromListingId,
} from '../services/ListingService';
export interface PendingCardProps {
  _id: string;
  hostId: string;
  guestId: Omit<User, 'password' | 'provider'>;
  listingId?: ListingDetails;
  requestId?: string;
  status: 'pending' | 'approved';
  time: Date;
  additionalInfo: string;
  hostInfo: string;
  paymentStatus?: 'pending' | 'succeeded';
}
/**
 * React.Dispatch<React.SetStateAction<Record<string, PendingCardProps[]>>>;
 * 2. React.SetStateAction<T>
This is a React type for updating state.
It allows you to set state either by passing a new value directly, or by passing a function that receives the previous state and returns the new state.
For example:
3. React.Dispatch<...>
This is the type of the setter function returned by useState.
It means: a function you call to update the state.
4. Putting it all together
React.Dispatch<React.SetStateAction<Record<string, PendingCardProps[]>>>
This is the type of the setter function (setMapping) for your mapping state.
It ensures that when you call setMapping, you must provide either:
a new Record<string, PendingCardProps[]> object, or
a function that takes the previous mapping and returns a new one.
 */
interface PendingMappingContextType {
  mapping: Record<string, PendingCardProps[]>;
  setMapping: React.Dispatch<
    React.SetStateAction<Record<string, PendingCardProps[]>>
  >;
  listings: ListingDetails[] | null;
}

const PendingMappingContext = createContext<
  PendingMappingContextType | undefined
>(undefined);

export const usePendingMapping = () => {
  const context = useContext(PendingMappingContext);
  if (!context) {
    throw new Error(
      'usePendingMapping must be used within a PendingMappingProvider',
    );
  }
  return context;
};

export const PendingMappingProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [mapping, setMapping] = useState<Record<string, PendingCardProps[]>>(
    {},
  );
  const [listings, setListings] = useState<ListingDetails[] | null>(null);

  const { currentUser } = useUser();
  const currUserId = currentUser?._id ?? 'undefined';

  // Fetch listings
  useEffect(() => {
    if (!currentUser) return;
    const fetchUserListing = async () => {
      const returnedListings = await getListingsByUserId(
        currUserId?.toString(),
      );
      setListings(returnedListings);
    };
    fetchUserListing();
  }, [currentUser, currUserId]);

  // Populate mapping
  useEffect(() => {
    const fetchMatches = async () => {
      if (!listings) return;
      const entries = await Promise.all(
        listings.map(async (listing) => {
          const matches = await getMatchesFromListingId(listing._id);
          return [listing._id, matches] as [string, PendingCardProps[]];
        }),
      );
      setMapping(Object.fromEntries(entries));
    };
    fetchMatches();
  }, [listings]);

  return (
    <PendingMappingContext.Provider value={{ mapping, setMapping, listings }}>
      {children}
    </PendingMappingContext.Provider>
  );
};
