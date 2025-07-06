import React from 'react';
import { AuthenticatedUser } from '../../../../shared/types/User';

interface ProfileHobbiesProps {
  profileUser: AuthenticatedUser;
}

const ProfileHobbies: React.FC<ProfileHobbiesProps> = ({ profileUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-brand-coral-700 mb-4 border-b border-brand-coral-100 pb-2">
        Hobbies & Interests
      </h2>
      <div className="flex flex-wrap gap-2">
        {profileUser.hobbies.map((hobby, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200 rounded-full text-sm"
          >
            {hobby}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold text-brand-coral-700 mb-3 border-b border-brand-coral-100 pb-1">
          Preferred Cuisines
        </h3>
        <div className="flex flex-wrap gap-2">
          {profileUser.cuisines && profileUser.cuisines.length > 0 ? (
            profileUser.cuisines.map((cuisine, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 rounded-full text-sm"
              >
                {cuisine}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No cuisines specified</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHobbies;
