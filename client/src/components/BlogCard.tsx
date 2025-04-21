import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { HeartIcon, MessageCircleIcon, SendIcon } from "lucide-react";
import { Blog } from "../../../shared/types/Blog";

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const openPhotoView = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePhotoView = () => {
    setSelectedPhotoIndex(null);
  };

  // Generate display name from user data
  const displayName = `${blog.userId.firstName} ${blog.userId.lastName}`;
  const userInitials = blog.userId.firstName.charAt(0) + blog.userId.lastName.charAt(0);

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={blog.userId.avatar} alt={displayName} />
          <AvatarFallback>{userInitials.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{displayName}</p>
          <p className="text-sm text-muted-foreground">@{blog.userId.userName} • {blog.createdAt}</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <h3 className="text-xl font-semibold mb-2">{blog.blogTitle}</h3>
        <p className="mb-4">{blog.blogContent}</p>

        {blog.photos.length > 0 && (
          <div className="relative mb-4">
            <div className={`grid ${blog.photos.length === 1 ? 'grid-cols-1' : blog.photos.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-2`}>
              {blog.photos.slice(0, blog.photos.length > 4 ? 4 : blog.photos.length).map((photo, index) => (
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
                      <span className="text-white text-xl font-semibold">+{blog.photos.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground">
          <span className="mr-4">{blog.likes} likes</span>
          <span>{blog.comments} comments</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex border-t p-4">
        <Button variant="ghost" className="mr-2 flex-1" onClick={() => console.log("Liked")}>
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
          <Button size="icon" className="self-center">
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Photo view modal */}
      {selectedPhotoIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closePhotoView}
        >
          <img 
            src={blog.photos[selectedPhotoIndex]} 
            alt="Enlarged view" 
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <button 
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
            onClick={closePhotoView}
          >
            X
          </button>
        </div>
      )}
    </Card>
  );
};

export default BlogCard;