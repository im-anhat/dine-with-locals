import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  HeartIcon,
  MessageCircleIcon,
  SendIcon,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { Blog } from '../../../shared/types/Blog';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blogId: string) => void;
  currentUserId?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  console.log('BlogCard received blog:', blog);

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const openPhotoView = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePhotoView = () => {
    setSelectedPhotoIndex(null);
  };

  const navigatePhoto = (e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.stopPropagation(); // Prevent the modal from closing when clicking navigation buttons

    if (selectedPhotoIndex === null || !blog.photos) return;

    if (direction === 'prev') {
      setSelectedPhotoIndex((prevIndex) =>
        prevIndex! === 0 ? blog.photos!.length - 1 : prevIndex! - 1,
      );
    } else {
      setSelectedPhotoIndex((prevIndex) =>
        prevIndex! === blog.photos!.length - 1 ? 0 : prevIndex! + 1,
      );
    }
  };

  // Handle case where userId might be a string (ID) or an object (populated user data)
  const user =
    typeof blog.userId === 'object' && blog.userId !== null
      ? blog.userId
      : {
          _id: typeof blog.userId === 'string' ? blog.userId : 'unknown',
          firstName: 'Unknown',
          lastName: 'User',
          userName: 'unknown',
          avatar: '',
        };

  // Check if current user is the author of the post
  const isAuthor = currentUserId && user._id === currentUserId;

  // Generate display name from user data
  const displayName = `${user.firstName} ${user.lastName}`;
  const userInitials = user.firstName.charAt(0) + user.lastName.charAt(0);

  // Format date - handle both string dates and Date objects
  const formattedDate = blog.createdAt
    ? typeof blog.createdAt === 'string' && blog.createdAt.includes('ago')
      ? blog.createdAt
      : formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })
    : 'Recently';

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={displayName} />
            <AvatarFallback>{userInitials.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold">{displayName}</p>
            <p className="text-sm text-muted-foreground">
              @{user.userName} • {formattedDate}
            </p>
          </div>
        </div>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(blog)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(blog._id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <h3 className="text-xl font-semibold mb-2">{blog.blogTitle}</h3>
        <p className="mb-4">{blog.blogContent}</p>

        {blog.photos && blog.photos.length > 0 && (
          <div className="relative mb-4">
            <div
              className={`grid ${blog.photos.length === 1 ? 'grid-cols-1' : blog.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-2`}
            >
              {blog.photos
                .slice(0, blog.photos.length > 4 ? 4 : blog.photos.length)
                .map((photo, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer ${index === 3 && blog.photos.length > 4 ? 'relative' : ''} overflow-hidden rounded-md`}
                    onClick={() => openPhotoView(index)}
                  >
                    <img
                      src={photo}
                      alt={`Blog photo ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    {index === 3 && blog.photos.length > 4 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xl font-semibold">
                          +{blog.photos.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <span className="mr-4">{blog.likes || 0} likes</span>
          <span>{blog.comments || 0} comments</span>
        </div>
      </CardContent>

      <CardFooter className="flex border-t p-4">
        <Button
          variant="ghost"
          className="mr-2 flex-1"
          onClick={() => console.log('Liked')}
        >
          <HeartIcon className="mr-2 h-4 w-4" />
          Like
        </Button>
        <Button variant="ghost" className="flex-1" onClick={toggleCommentForm}>
          <MessageCircleIcon className="mr-2 h-4 w-4" />
          Comment
        </Button>
      </CardFooter>

      {showCommentForm && (
        <div className="p-4 pt-0 flex">
          <Textarea
            placeholder="Add a comment..."
            className="min-h-[60px] mr-2"
          />
          <Button size="icon" className="self-center bg-brand-coral-300">
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Photo view modal */}
      {selectedPhotoIndex !== null && blog.photos && blog.photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closePhotoView}
        >
          <div
            className="relative flex items-center justify-center w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={blog.photos[selectedPhotoIndex]}
              alt={`Photo ${selectedPhotoIndex + 1} of ${blog.photos.length}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            {/* Navigation buttons */}
            {blog.photos.length > 1 && (
              <>
                <button
                  className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => navigatePhoto(e, 'prev')}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={(e) => navigatePhoto(e, 'next')}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Photo counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedPhotoIndex + 1} / {blog.photos.length}
            </div>

            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={closePhotoView}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BlogCard;
