import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import PostInput from '../components/PostInput';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { Blog } from '../../../shared/types/Blog';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useUserContext } from '../hooks/useUserContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const FeedPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUserContext();

  // Fetch all blogs when component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      console.log('Fetching blogs from:', `${API_URL}/blogs`);
      const response = await axios.get(`${API_URL}/blogs`);
      console.log('Blogs response:', response.data);
      setBlogs(response.data);
      console.log('Blogs set to state:', response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blogs. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleCreatePost = async (data: {
    title: string;
    content: string;
    photos: File[];
  }) => {
    try {
      setIsSubmitting(true);

      if (!currentUser || !currentUser._id) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to create a post.',
          variant: 'destructive',
        });
        setIsDialogOpen(false);
        return;
      }

      console.log('Creating blog with:', {
        userId: currentUser._id,
        blogTitle: data.title,
        blogContent: data.content,
      });

      // Make API call to create blog using the current userId
      const response = await axios.post(`${API_URL}/blogs`, {
        userId: currentUser._id,
        blogTitle: data.title,
        blogContent: data.content,
      });

      console.log('New blog created:', response.data);

      // Add new blog to the list
      setBlogs([response.data, ...blogs]);

      toast({
        title: 'Success',
        description: 'Your blog post has been created!',
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to create blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feeds</h1>
        <Button
          className="bg-brand-coral-300 rounded-full"
          onClick={handleOpenDialog}
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          New Post
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create A New Post</DialogTitle>
          </DialogHeader>
          <PostInput
            onSubmit={handleCreatePost}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-coral-300"></div>
        </div>
      ) : blogs.length > 0 ? (
        <div>
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No blogs found. Create your first post!
          </p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;
