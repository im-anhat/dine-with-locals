import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Tag } from 'lucide-react';
import { ListingDetails } from '../../../../../shared/types/ListingDetails';
function ListingHeaderCard({ ...props }: ListingDetails) {
  console.log('PROPS', props);

  return (
    <Card className="w-full rounded-xl border border-gray-200 shadow-none">
      <CardContent className="flex flex-row gap-8 p-6">
        {/* Image placeholder */}
        {props.images.length === 0 ? (
          <div className="flex-shrink-0 w-[340px] h-[180px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        ) : (
          // Display the first image if available
          <img
            src={props.images[0]}
            className="flex-shrink-0 w-[340px] h-[180px] rounded-lg"
          />
        )}
        {/* Details */}
        <div className="flex flex-col justify-center flex-1 gap-2">
          <div className="font-semibold text-lg mb-2">{props.title}</div>
          <div className="flex flex-row flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-start gap-2 min-w-[180px]">
              <MapPin className="w-5 h-5 mt-0.5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Location</div>

                <div className="text-sm text-gray-700">
                  {props.locationId.address}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 min-w-[180px]">
              <Clock className="w-5 h-5 mt-0.5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Date & Time</div>
                <div className="text-sm text-gray-700">
                  {props.time
                    ? new Date(props.time).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 min-w-[120px]">
              <Users className="w-5 h-5 mt-0.5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Guest</div>
                <div className="text-sm text-gray-700">
                  {props.numGuests} guests
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 min-w-[160px]">
              <Tag className="w-5 h-5 mt-0.5 text-gray-600" />
              <div>
                <div className="font-medium text-sm">Tags</div>
                <div className="flex flex-row gap-2 mt-1">
                  {props.cuisine.map((tag, idx) => (
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
