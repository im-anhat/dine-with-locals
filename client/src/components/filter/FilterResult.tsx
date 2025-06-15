import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

const FilterResults = ({ results }: { results: any[] }) => {
  const navigate = useNavigate();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-6xl mb-4"></div>
        <h3 className="text-lg font-medium mb-2">No results found</h3>
        <p className="text-sm">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return dateString;
    }
  };
  const openPhotoView = (index: number) => {
    setSelectedPhotoIndex(index);
  };
  return (
    <div className="">
      <div className="text-sm text-gray-600 mb-4">
        {results.length} result{results.length !== 1 ? 's' : ''} found
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((item, idx) => (
          <Card
            key={idx}
            className="w-full hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              {/* Header: Avatar + Name + Time */}
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={item.userInfo.avatar}
                    alt={item.userInfo.firstName}
                  />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {item.userInfo.firstName} {item.userInfo.lastName}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(item.time)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Title and Status */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 break-words">
                  {item.title || 'Untitled Reservation'}
                </h3>
              </div>
              {/* Additional Information about Listing */}
              {item.additionalInfo ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.additionalInfo}
                </p>
              ) : (
                <></>
              )}

              {/* IMAGES */}
              {item.images && item.images.length > 0 && (
                <div className="relative mb-4">
                  <div
                    className={`grid ${item.images.length === 1 ? 'grid-cols-1' : item.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-2`}
                  >
                    {item.images
                      .slice(0, item.images.length > 4 ? 4 : item.images.length)
                      .map((photo: string, index: number) => (
                        <div
                          key={index}
                          className={`relative cursor-pointer ${index === 3 && item.images.length > 4 ? 'relative' : ''} overflow-hidden rounded-md`}
                          onClick={() => openPhotoView(index)}
                        >
                          <img
                            src={photo}
                            alt={`Card photo ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          {index === 3 && item.images.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-xl font-semibold">
                                +{item.images.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {/* Button to create a new Match document */}
              <div className="flex gap-2">
                <Button className="bg-brand-stone-700 hover:bg-brand-stone-800">
                  <Link
                    to={`/filter/${item._id}`}
                    state={{ content: item }}
                    className="w-full text-center"
                  >
                    View Details
                  </Link>
                </Button>
                <Button className="book">Book now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View all cards */}
      <Button
        variant="link"
        className="text-brand-teal-600 p-0 h-auto font-normal"
        onClick={() => navigate('/filter', { state: { results } })}
      >
        View All Requests →
      </Button>
    </div>
  );
};

export default FilterResults;
