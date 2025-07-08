import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PendingCardProps } from '../HostSidePending';
import { approveMatch, deleteMatch } from '@/services/MatchService';

function EventTable({
  guests,
}: {
  guests: PendingCardProps[];
}): React.ReactElement {
  const handleApprove = async (matchingId: string) => {
    try {
      const updatedMatch = await approveMatch(matchingId);
      console.log('Match approved:', updatedMatch);
    } catch (error) {
      console.error('Error approving match:', error);
    }
  };

  // Function to handle the rejection of a match
  const handleReject = async (matchingId: string) => {
    try {
      await deleteMatch(matchingId);
      console.log('Match rejected:', matchingId);
    } catch (error) {
      console.error('Error rejecting match:', error);
    }
  };
  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow p-6 mb-4 w-full max-w-5xl mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest._id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">
                {guest.guestId.firstName} {guest.guestId.lastName}
              </TableCell>
              <TableCell className="font-medium">
                {guest.guestId.phone}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-row gap-2 justify-end">
                  <Button onClick={() => handleApprove(guest._id)}>
                    Approve
                  </Button>
                  <Button
                    className="bg-gray-200 text-gray-900"
                    onClick={() => handleReject(guest._id)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default EventTable;
