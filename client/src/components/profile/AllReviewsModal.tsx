import React from 'react';
import { Review } from '../../services/ReviewService';

interface AllReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  profileFirstName: string;
}

const AllReviewsModal: React.FC<AllReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  profileFirstName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur effect - covers the entire screen without any whitespace */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      ></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center overflow-auto p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto z-10">
          <div className="sticky top-0 bg-white border-b border-brand-stone-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-brand-coral-700">
              All Reviews for {profileFirstName}
            </h2>
            <button
              onClick={onClose}
              className="text-brand-stone-500 hover:text-brand-coral-500 transition-colors"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-brand-stone-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <img
                        src={review.reviewerId.avatar}
                        alt={`${review.reviewerId.firstName} ${review.reviewerId.lastName}`}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                      <div>
                        <div className="font-medium text-brand-stone-700">
                          {review.reviewerId.firstName}{' '}
                          {review.reviewerId.lastName}
                        </div>
                        <div className="text-sm text-brand-stone-500">
                          @{review.reviewerId.userName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${
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
                      <span className="text-xs text-brand-stone-500">
                        {new Date(review.updatedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                  </div>
                  <p className="text-brand-stone-600 mt-3">{review.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-brand-stone-500">
                No reviews yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviewsModal;
