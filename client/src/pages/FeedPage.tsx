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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const FeedPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const { toast } = useToast();

  // Hardcoded current user ID for demo purposes
  const currentUserId = '67f7f8281260844f9625ee33';

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

  const handleOpenCreateDialog = () => {
    setCurrentBlog(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (blog: Blog) => {
    setCurrentBlog(blog);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentBlog(null);
  };

  const handleCreateOrUpdatePost = async (data: {
    title: string;
    content: string;
    photos: File[];
  }) => {
    try {
      setIsSubmitting(true);

      let imageUrls: string[] = [];

      // Upload images to Cloudinary
      if (data.photos.length > 0) {
        const formData = new FormData();
        data.photos.forEach((photo) => {
          formData.append('images', photo);
        });

        console.log('Uploading images to Cloudinary...');
        const uploadResponse = await axios.post(
          `${API_URL}/upload/images`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        imageUrls = uploadResponse.data.imageUrls;
        console.log('Images uploaded successfully:', imageUrls);
      }

      if (currentBlog) {
        // EDIT MODE
        console.log('Updating blog with:', {
          blogTitle: data.title,
          blogContent: data.content,
          photos: imageUrls.length > 0 ? imageUrls : currentBlog.photos,
        });

        const response = await axios.put(
          `${API_URL}/blogs/${currentBlog._id}`,
          {
            blogTitle: data.title,
            blogContent: data.content,
            photos: imageUrls.length > 0 ? imageUrls : currentBlog.photos,
          },
        );

        console.log('Blog updated:', response.data);

        // Update the blogs array with the edited blog
        setBlogs(
          blogs.map((blog) =>
            blog._id === currentBlog._id ? response.data : blog,
          ),
        );

        toast({
          title: 'Success',
          description: 'Your blog post has been updated!',
        });
      } else {
        // CREATE MODE
        console.log('Creating blog with:', {
          userId: currentUserId,
          blogTitle: data.title,
          blogContent: data.content,
          photos: imageUrls,
        });

        // Make API call to create blog post
        const response = await axios.post(`${API_URL}/blogs`, {
          userId: currentUserId,
          blogTitle: data.title,
          blogContent: data.content,
          photos: imageUrls,
        });

        console.log('New blog created:', response.data);

        // Add new blog to the list
        setBlogs([response.data, ...blogs]);

        toast({
          title: 'Success',
          description: 'Your blog post has been created!',
        });
      }

      setIsDialogOpen(false);
      setCurrentBlog(null);
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to save blog post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (blogId: string) => {
    try {
      // Show confirmation dialog using toast
      if (!window.confirm('Are you sure you want to delete this post?')) {
        return;
      }

      console.log('Deleting blog with ID:', blogId);
      await axios.delete(`${API_URL}/blogs/${blogId}`);

      // Remove the deleted blog from the state
      setBlogs(blogs.filter((blog) => blog._id !== blogId));

      toast({
        title: 'Success',
        description: 'Blog post has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feeds</h1>
        <Button
          className="bg-brand-coral-300 rounded-full"
          onClick={handleOpenCreateDialog}
        >
          <PlusIcon className="mr-1 h-4 w-4" />
          New Post
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentBlog ? 'Edit Post' : 'Create A New Post'}
            </DialogTitle>
          </DialogHeader>
          <PostInput
            onSubmit={handleCreateOrUpdatePost}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
            initialValues={
              currentBlog
                ? {
                    title: currentBlog.blogTitle,
                    content: currentBlog.blogContent,
                  }
                : undefined
            }
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
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeletePost}
              currentUserId={currentUserId}
            />
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
