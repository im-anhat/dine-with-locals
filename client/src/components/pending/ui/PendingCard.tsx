import { Button } from '@/components/ui/button';
import { PendingCardProps } from '../HostSidePending';

function PendingCard({
  firstName,
  lastName,
  avatar,
  hobbies,
  cuisines,
  ethnicity,
  bio,
  dietary,
  additionalNotes,
  languages,
}: PendingCardProps): React.ReactElement<PendingCardProps> {
  return (
    <div className="rounded-xl border bg-white text-gray-900 shadow p-6 mb-4 w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between gap-10">
        {/* Left: Avatar and Name */}
        <div className="flex flex-col gap-4 items-center min-w-[180px]">
          <img src={avatar} />
          <div>
            <h2 className="font-semibold text-lg">
              {firstName} {lastName}
            </h2>
          </div>
        </div>
        {/* Middle: Bio, Tags */}
        <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
          <div>
            <h3 className="font-semibold text-sm mb-1">Bio</h3>
            <p className="text-sm text-gray-700">{bio}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1">Tags</h3>
            <div className="flex flex-row gap-2 flex-wrap">
              <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
                {ethnicity}
              </span>
              {dietary?.map((dietaryRestriction) => (
                <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
                  {dietaryRestriction}
                </span>
              ))}
              {hobbies?.map((hobby) => (
                <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
                  {hobby}
                </span>
              ))}
              {cuisines?.map((cuisine) => (
                <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs">
                  {cuisine}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <span className="block text-xs text-gray-500">Language</span>
            {languages?.map((language) => (
              <span className="text-sm">{language}</span>
            ))}
          </div>
        </div>
        {/* Right: Notes and Actions */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          <div>
            <h3 className="font-semibold text-sm mb-1">Additional notes</h3>
            <p className="text-sm text-gray-700">{additionalNotes}</p>
          </div>
          <div className="flex flex-row gap-2 justify-end">
            <Button>Approve</Button>
            <Button className="bg-gray-200 text-gray-900">Reject</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingCard;
