import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '../../../../../shared/types/User';
import { ListingDetails } from '../../../../../shared/types/ListingDetails';
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
interface GuestDetailsCardProps {
  data: PendingCardProps[];
}
function GuestDetailsCard({ data }: GuestDetailsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((prop) => (
              <TableRow key={prop._id}>
                <TableCell>
                  {prop.guestId.firstName} {prop.guestId.lastName}
                </TableCell>
                <TableCell>
                  {prop.listingId?.fee
                    ? `$${prop.listingId.fee.toFixed(2)}`
                    : 'Free'}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prop.paymentStatus === 'succeeded'
                        ? 'bg-green-100 text-green-800'
                        : prop.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {prop.paymentStatus === 'succeeded'
                      ? 'Paid'
                      : prop.paymentStatus === 'pending'
                        ? 'Payment Pending'
                        : prop.listingId?.fee && prop.listingId.fee > 0
                          ? 'Payment Required'
                          : 'No Payment Required'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default GuestDetailsCard;
