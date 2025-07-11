import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { getReviewsByUserId } from '../../../services/ReviewService';
import { useEffect } from 'react';
import { Review } from '../../../services/ReviewService';
import { useNavigate } from 'react-router-dom';
interface GuestReviewCardProps {
  guestId: string;
}

function GuestReviewCard({ guestId }: GuestReviewCardProps) {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await getReviewsByUserId(guestId);
        // Process reviews as needed
        setReviews(reviews);
        console.log('Fetched reviews:', reviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, [guestId]);
  return (
    <Card className="w-full">
      {reviews.length === 0 ? (
        <CardContent className="text-center text-gray-500 pt-4">
          No reviews yet.
        </CardContent>
      ) : (
        reviews.map((review) => (
          <CardContent key={review._id}>
            <div className="flex items-center gap-4 mb-2 pt-4">
              <Avatar
                onClick={() => navigate(`/profile/${review.reviewerId._id}`)}
              >
                <AvatarImage
                  src={review.reviewerId.avatar}
                  alt={
                    review.reviewerId.firstName +
                    ' ' +
                    review.reviewerId.lastName
                  }
                />
                <AvatarFallback>
                  {review.reviewerId.firstName} {review.reviewerId.lastName}
                </AvatarFallback>
              </Avatar>
              <div>
                <div
                  className="font-medium"
                  onClick={() => navigate(`/profile/${review.reviewerId._id}`)}
                >
                  {review.reviewerId.firstName} {review.reviewerId.lastName}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  {[...Array(5 - review.rating)].map((_, idx) => (
                    <Star key={idx} size={16} className="text-gray-300" />
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-800">{review.content}</div>
          </CardContent>
        ))
      )}
    </Card>
  );
}

export default GuestReviewCard;
