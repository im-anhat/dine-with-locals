import React from 'react';
import { Review } from '../../services/ReviewService';

interface ProfileReviewsProps {
  reviews: Review[];
  isOwnProfile: boolean;
  profileFirstName: string;
}

const ProfileReviews: React.FC<ProfileReviewsProps> = ({
  reviews,
  isOwnProfile,
  profileFirstName,
}) => {
  const topThreeReviews = reviews.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-brand-coral-700 pb-1">
          {isOwnProfile
            ? 'What Others Are Saying'
            : `Reviews for ${profileFirstName}`}
        </h2>
        <button className="text-sm text-brand-coral-600 hover:text-brand-coral-700 hover:underline">
          Show more reviews
        </button>
      </div>

      <div className="space-y-6">
        {topThreeReviews.map((review) => (
          <div
            key={review._id}
            className="border-b border-brand-stone-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="font-medium text-brand-stone-700">
                  @{review.reviewerId.userName}
                </span>
                <span className="mx-2 text-brand-stone-300">•</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-brand-coral-500'
                          : 'text-brand-stone-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <span className="text-xs text-brand-stone-500">
                {new Date(review.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-brand-stone-600">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileReviews;
