import React from 'react';

interface ProfileStatsProps {
  matchesCount: number;
  blogsCount: number;
  reviewsCount: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  matchesCount,
  blogsCount,
  reviewsCount,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-brand-coral-700 mb-4 border-b border-brand-coral-100 pb-2">
        Activity Stats
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-stone-100 pb-3">
          <span className="text-brand-stone-600">Matches</span>
          <span className="bg-gradient-to-r from-brand-coral-400 to-brand-coral-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            {matchesCount}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-brand-stone-100 pb-3">
          <span className="text-brand-stone-600">Blog Posts</span>
          <span className="bg-gradient-to-r from-brand-coral-300 to-brand-coral-400 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            {blogsCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-brand-stone-600">Reviews</span>
          <span className="bg-gradient-to-r from-brand-coral-400 to-brand-coral-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
            {reviewsCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
