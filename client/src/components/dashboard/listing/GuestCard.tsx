import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PendingCardProps } from '../../pending/HostSidePending';
import { approveMatch, deleteMatch } from '@/services/MatchService';
import { useNavigate } from 'react-router';
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

function GuestCard({
  items,
}: {
  items: PendingCardProps[];
}): React.ReactElement<PendingCardProps> {
  const navigate = useNavigate();
  // Function to handle the approval of a match
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
    <>
      {items.map((item) => (
        <Card className="w-full max-w-5xl mx-auto hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-6">
              {/* Left section - Avatar and User Info */}
              <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
                <Avatar
                  className="h-14 w-14"
                  onClick={() => navigate(`/profile/${item.guestId._id}`)}
                >
                  <AvatarImage
                    src={item.guestId.avatar}
                    alt={`${item.guestId.firstName} ${item.guestId.lastName}`}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                    {getInitials(item.guestId.firstName, item.guestId.lastName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1">
                  <h3
                    className="font-semibold text-lg text-gray-900 leading-none"
                    onClick={() => navigate(`/profile/${item.guestId._id}`)}
                  >
                    {item.guestId.firstName} {item.guestId.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 leading-none">Guest</p>
                </div>
              </div>

              {/* Center section - View Details */}
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
                  <PendingCard {...item} />
                </DialogContent>
              </Dialog>

              {/* Right section - Action Buttons */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {item.status === 'approved' ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 px-4 py-2 text-sm font-medium"
                  >
                    Approved
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        console.log('approve clicked');
                        handleApprove(item._id);
                      }}
                      className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 text-sm font-medium transition-colors"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        console.log('reject clicked');
                        handleReject(item._id);
                      }}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-6 py-2 text-sm font-medium transition-colors"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default GuestCard;
