import { Button } from '@/components/ui/button';
import { PendingCardProps } from '../HostSidePending';
import { approveMatch, deleteMatch } from '@/services/MatchService';
import { useNavigate } from 'react-router';
function PendingCard({
  ...props
}: PendingCardProps): React.ReactElement<PendingCardProps> {
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

  return (
    <div>
      {/* Avatar and Name */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={props.guestId.avatar}
          alt={`${props.guestId.firstName} ${props.guestId.lastName}`}
          className="rounded-full w-20 h-20 object-cover mb-3"
          onClick={() => navigate(`/profile/${props.guestId._id}`)}
        />
        <div className="text-center">
          <h2
            className="font-semibold text-lg mb-1"
            onClick={() => navigate(`/profile/${props.guestId._id}`)}
          >
            {props.guestId.firstName} {props.guestId.lastName}
          </h2>
          <button
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => navigate(`/profile/${props.guestId._id}`)}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Tags Section */}
      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">
            {props.guestId.ethnicity}
          </span>
          {props.listingId?.dietary.map((dietaryRestriction, idx) => (
            <span
              key={dietaryRestriction + idx}
              className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
            >
              {dietaryRestriction}
            </span>
          ))}
          {props.guestId?.hobbies.map((hobby, idx) => (
            <span
              key={hobby + idx}
              className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
            >
              {hobby}
            </span>
          ))}
          {props.listingId?.cuisine.map((cuisine, idx) => (
            <span
              key={cuisine + idx}
              className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
            >
              {cuisine}
            </span>
          ))}
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-2">Bio</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {props.guestId.bio}
        </p>
      </div>

      {/* Additional Notes Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">Additional notes</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {props.additionalInfo}
        </p>
      </div>

      {/* Languages */}
      {props.guestId.languages && props.guestId.languages.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-2">Languages</h3>
          <div className="flex flex-wrap gap-1">
            {props.guestId.languages.map((language, idx) => (
              <span key={language + idx} className="text-sm text-gray-700">
                {language}
                {idx < props.guestId.languages.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {props.status === 'approved' ? (
        <div className="text-center py-2">
          <span className="text-green-600 font-semibold">Approved</span>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button
            onClick={() => {
              console.log('clicked');
              handleApprove(props._id);
            }}
            className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
          >
            Approve
          </Button>
          <Button
            onClick={() => {
              console.log('reject clicked');
              handleReject(props._id);
            }}
            variant="outline"
            className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

export default PendingCard;
