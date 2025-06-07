import React, { useState, useEffect } from 'react';
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
import { BlogWithUser } from '../services/BlogService';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Comment {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    userName: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

interface BlogCardProps {
  blog: Blog | BlogWithUser;
  onEdit: (blog: Blog | BlogWithUser) => void;
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
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog.likes || 0);
  const [commentsCount, setCommentsCount] = useState(blog.comments || 0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  console.log('BlogCard received blog:', blog);

  // Check like status when component mounts
  useEffect(() => {
    if (currentUserId && blog._id) {
      checkLikeStatus();
    }
  }, [currentUserId, blog._id]);

  // Fetch comments when comment section is opened
  useEffect(() => {
    if (showCommentForm) {
      fetchComments();
    }
  }, [showCommentForm]);

  const checkLikeStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/likes/check`, {
        params: {
          userId: currentUserId,
          blogId: blog._id,
        },
      });
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const fetchComments = async () => {
    if (!blog._id) return;

    try {
      setLoadingComments(true);
      const response = await axios.get(`${API_URL}/comments/blog/${blog._id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!currentUserId) {
      alert('Please log in to like this post');
      return;
    }

    try {
      if (isLiked) {
        // Unlike the post
        await axios.delete(`${API_URL}/likes`, {
          data: {
            userId: currentUserId,
            blogId: blog._id,
          },
        });
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like the post
        await axios.post(`${API_URL}/likes`, {
          userId: currentUserId,
          blogId: blog._id,
        });
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!currentUserId || !newComment.trim()) {
      return;
    }

    try {
      setIsSubmittingComment(true);
      const response = await axios.post(`${API_URL}/comments`, {
        blogId: blog._id,
        userId: currentUserId,
        content: newComment.trim(),
      });

      setComments([response.data, ...comments]);
      setNewComment('');
      setCommentsCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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
    <Card className="mb-6 overflow-hidden max-h-[650px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 flex-shrink-0">
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

      <CardContent className="p-4 pt-0 overflow-y-auto flex-1">
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
          <span className="mr-4">{likesCount} likes</span>
          <span
            className="cursor-pointer hover:text-brand-coral-400 hover:underline"
            onClick={toggleCommentForm}
          >
            {commentsCount} comments
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex border-t p-4 flex-shrink-0">
        <Button
          variant={isLiked ? 'default' : 'ghost'}
          className={`mr-2 flex-1 ${isLiked ? 'bg-brand-coral-300 hover:bg-brand-coral-400' : ''}`}
          onClick={handleLike}
        >
          <HeartIcon
            className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
          />
          {isLiked ? 'Liked' : 'Like'}
        </Button>
        <Button variant="ghost" className="flex-1" onClick={toggleCommentForm}>
          <MessageCircleIcon className="mr-2 h-4 w-4" />
          Comment
        </Button>
      </CardFooter>

      {showCommentForm && (
        <>
          <div className="p-4 pt-0 flex flex-shrink-0">
            <Textarea
              placeholder="Add a comment..."
              className="min-h-[60px] mr-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmittingComment}
            />
            <Button
              size="icon"
              className="self-center bg-brand-coral-300"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmittingComment}
            >
              {isSubmittingComment ? (
                <span className="animate-spin">◌</span>
              ) : (
                <SendIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="px-4 pb-4">
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-brand-coral-300"></div>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4 mt-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex gap-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage
                        src={comment.userId.avatar}
                        alt={`${comment.userId.firstName} ${comment.userId.lastName}`}
                      />
                      <AvatarFallback>
                        {comment.userId.firstName.charAt(0) +
                          comment.userId.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted rounded-lg p-2">
                        <p className="font-medium text-sm">
                          {comment.userId.firstName} {comment.userId.lastName}
                        </p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm py-2">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </>
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
