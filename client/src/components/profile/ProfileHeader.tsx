import React from 'react';
import { User } from '../../../../shared/types/User';

interface ProfileHeaderProps {
  profileUser: User;
  isOwnProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileUser,
  isOwnProfile,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-brand-coral-500 to-brand-teal-400 relative">
        <img
          src="https://images.template.net/wp-content/uploads/2014/11/Natural-Facebook-Cover-Photo.jpg"
          alt="Cover Photo"
          className="w-full h-full object-cover opacity-85"
        />
      </div>

      {/* Profile Info */}
      <div className="px-6 py-4 relative">
        <div className="absolute -top-20 left-6">
          <img
            src={profileUser.avatar}
            alt={`${profileUser.firstName}'s avatar`}
            className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-md"
          />
        </div>
        <div className="mt-16 md:mt-0 md:ml-48">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-brand-stone-800">
                  {profileUser.firstName} {profileUser.lastName}
                </h1>
                {isOwnProfile && (
                  <button className="ml-3 text-brand-stone-500 hover:text-brand-coral-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-sm text-brand-stone-500">
                @{profileUser.userName}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-brand-coral-100 text-brand-coral-700 rounded-full text-xs font-medium border border-brand-coral-200">
                  {profileUser.role}
                </span>
                <span className="px-3 py-1 bg-brand-stone-100 text-brand-stone-700 rounded-full text-xs font-medium border border-brand-stone-200">
                  {profileUser.ethnicity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
