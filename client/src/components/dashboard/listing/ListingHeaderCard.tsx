import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Tag } from 'lucide-react';

interface ListingHeaderCardProps {
  imageUrl?: string;
  title?: string;
  location?: string;
  dateTime?: string;
  guests?: number;
  tags?: string[];
}

function ListingHeaderCard({
  imageUrl = '',
  title = 'Pho with Locals',
  location = '60 W Adams St, Chicago, IL 60603',
  dateTime = '12:00 PM · July 20, 2025',
  guests = 3,
  tags = ['Vietnamese', 'Vegan-friendly'],
}: ListingHeaderCardProps) {
  return (
    <Card className="w-full rounded-xl border border-gray-200 shadow-none">
      <CardContent className="flex flex-row gap-8 p-6">
        {/* Image placeholder */}
        <div className="flex-shrink-0 w-[340px] h-[180px] bg-gray-200 rounded-lg" />
        {/* Details */}
        <div className="flex flex-col justify-center flex-1 gap-2">
          <div className="font-semibold text-lg mb-2">{title}</div>
          <div className="flex flex-row flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-start gap-2 min-w-[180px]">
              <MapPin className="w-5 h-5 mt-0.5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Location</div>
                <div className="text-sm text-gray-700">{location}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 min-w-[180px]">
              <Clock className="w-5 h-5 mt-0.5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Date & Time</div>
                <div className="text-sm text-gray-700">{dateTime}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 min-w-[120px]">
              <Users className="w-5 h-5 mt-0.5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Guest</div>
                <div className="text-sm text-gray-700">{guests} guests</div>
              </div>
            </div>
            <div className="flex items-start gap-2 min-w-[160px]">
              <Tag className="w-5 h-5 mt-0.5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Tags</div>
                <div className="flex flex-row gap-2 mt-1">
                  {tags.map((tag, idx) => (
                    <Badge
                      key={tag + idx}
                      variant="outline"
                      className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ListingHeaderCard;
