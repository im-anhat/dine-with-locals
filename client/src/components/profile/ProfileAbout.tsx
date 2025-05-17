import React from 'react';
import { User } from '../../../../shared/types/User';

interface ProfileAboutProps {
  profileUser: User;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ profileUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-brand-coral-700 mb-4 border-b border-brand-coral-100 pb-2">
        About Me
      </h2>
      <p className="text-brand-stone-600">{profileUser.bio}</p>

      <h3 className="text-md font-semibold text-brand-coral-700 mt-6 mb-2 border-b border-brand-coral-100 pb-1">
        Contact
      </h3>
      <div className="space-y-2">
        <p className="text-brand-stone-600 flex items-center">
          <svg
            className="w-4 h-4 mr-3 text-brand-coral-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
          </svg>
          {profileUser.phone}
        </p>
        <p className="text-brand-stone-600 flex items-center">
          <svg
            className="w-4 h-4 mr-3 text-brand-coral-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
          </svg>
          <a
            href={profileUser.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-coral-600 hover:text-brand-coral-700 hover:underline"
          >
            LinkedIn Profile
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProfileAbout;
