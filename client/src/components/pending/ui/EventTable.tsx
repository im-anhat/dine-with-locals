import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import PendingCard from '../../../components/pending/ui/PendingCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { PendingCardProps } from '../HostSidePending';
import { approveMatch, deleteMatch } from '@/services/MatchService';
import { useNavigate } from 'react-router';

function EventTable({
  guests,
}: {
  guests: PendingCardProps[];
}): React.ReactElement {
  const navigate = useNavigate();
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
  // Get user's initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow p-6 mb-4 w-full max-w-5xl mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead></TableHead>
            <TableHead className="text-right px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest._id}>
              <TableCell>
                <Avatar
                  className="h-14 w-14"
                  onClick={() => navigate(`/profile/${guest.guestId._id}`)}
                >
                  <AvatarImage
                    src={guest.guestId.avatar}
                    alt={`${guest.guestId.firstName} ${guest.guestId.lastName}`}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                    {getInitials(
                      guest.guestId.firstName,
                      guest.guestId.lastName,
                    )}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">
                {guest.guestId.firstName} {guest.guestId.lastName}
              </TableCell>
              <TableCell className="font-medium">
                {guest.guestId.phone}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    <div className="flex-1 flex justify-center">
                      <Button
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium px-6 py-2"
                      >
                        View Guest details
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <PendingCard {...guest} />
                  </DialogContent>
                </Dialog>
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
