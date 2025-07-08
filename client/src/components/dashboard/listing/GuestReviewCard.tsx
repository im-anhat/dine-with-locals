import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface GuestReviewCardProps {
  reviewerName?: string;
  reviewerAvatar?: string;
  rating?: number;
  reviewText?: string;
  reviewDate?: string;
}

function GuestReviewCard({
  reviewerName = 'John Smith',
  reviewerAvatar = '',
  rating = 5,
  reviewText = 'Wonderful guest! Very polite and respectful.',
  reviewDate = 'March 12, 2025',
}: GuestReviewCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Guest Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-2">
          <Avatar>
            <AvatarImage src={reviewerAvatar} alt={reviewerName} />
            <AvatarFallback>
              {reviewerName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{reviewerName}</div>
            <div className="flex items-center gap-1">
              {[...Array(rating)].map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
              {[...Array(5 - rating)].map((_, idx) => (
                <Star key={idx} size={16} className="text-gray-300" />
              ))}
            </div>
            <div className="text-xs text-gray-500">{reviewDate}</div>
          </div>
        </div>
        <div className="text-sm text-gray-800">{reviewText}</div>
      </CardContent>
    </Card>
  );
}

export default GuestReviewCard;
