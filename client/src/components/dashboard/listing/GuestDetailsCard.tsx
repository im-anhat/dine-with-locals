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
              {/* <TableHead>Received Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead> */}

              {/* DISPLAY PAYMENT */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((prop) => (
              <TableRow key={prop._id}>
                <TableCell>
                  {prop.guestId.firstName} {prop.guestId.lastName}
                </TableCell>
                {/* <TableCell>{prop.guestId.phone}</TableCell>

                <TableCell>
                  {new Date(prop.time).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </TableCell> */}
                {/* ADD FEE HERE */}
                {/* <TableCell></TableCell>
                <TableCell>{prop.status}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default GuestDetailsCard;
