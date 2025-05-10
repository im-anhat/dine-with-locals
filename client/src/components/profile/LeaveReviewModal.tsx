import React, { useState } from 'react';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, content: string) => Promise<void>;
  submitting: boolean;
  error: string | null;
  profileFirstName: string;
}

const LeaveReviewModal: React.FC<LeaveReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  error,
  profileFirstName,
}) => {
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(3);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(reviewRating, reviewContent);
    setReviewContent('');
    setReviewRating(5);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10">
        <h3 className="text-lg font-semibold mb-4 text-brand-coral-700">
          Leave a Review for {profileFirstName}
        </h3>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-brand-stone-700 font-medium mr-2">
              Rating:
            </span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`focus:outline-none ${star <= reviewRating ? 'text-brand-coral-500' : 'text-brand-stone-300'}`}
                onClick={() => setReviewRating(star)}
                aria-label={`Set rating to ${star}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <div className="mb-4">
            <textarea
              className="w-full border border-brand-stone-200 rounded-md p-2 focus:ring-2 focus:ring-brand-coral-300"
              rows={4}
              placeholder="Share your experience..."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-brand-coral-500 mb-2 text-sm">{error}</div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-brand-stone-200 text-brand-stone-700 hover:bg-brand-stone-300"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-brand-coral-500 text-white font-medium hover:bg-brand-coral-600 disabled:opacity-60"
              disabled={submitting || !reviewContent.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveReviewModal;
