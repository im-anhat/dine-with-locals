import React from 'react';
import { BlogWithUser } from '../../services/BlogService';
import BlogCard from '../BlogCard';
import { useUser } from '../../contexts/UserContext';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ProfileBlogsProps {
  blogs: BlogWithUser[];
  loading: boolean;
  error: string | null;
  isOwnProfile: boolean;
  profileFirstName: string;
  onRetry: () => void;
  onUpdateBlogs?: (updatedBlogs: BlogWithUser[]) => void;
}

const ProfileBlogs: React.FC<ProfileBlogsProps> = ({
  blogs,
  loading,
  error,
  isOwnProfile,
  profileFirstName,
  onRetry,
  onUpdateBlogs,
}) => {
  const { currentUser } = useUser();
  const { toast } = useToast();

  const handleEdit = (blog: BlogWithUser | any) => {
    // For now, just log the edit action
    // You can implement your edit functionality here
    console.log('Edit blog:', blog);
    toast({
      title: 'Edit Blog',
      description: 'Edit functionality to be implemented',
    });
  };

  const handleDelete = async (blogId: string) => {
    try {
      if (!window.confirm('Are you sure you want to delete this post?')) {
        return;
      }

      await axios.delete(`${API_URL}/blogs/${blogId}`);

      // Update the blogs list by removing the deleted blog
      if (onUpdateBlogs) {
        const updatedBlogs = blogs.filter((blog) => blog._id !== blogId);
        onUpdateBlogs(updatedBlogs);
      }

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-brand-coral-700 pb-1">
          {isOwnProfile ? 'My Blog Posts' : `${profileFirstName}'s Blog Posts`}
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-coral-500"></div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-brand-coral-500">{error}</p>
          <button
            className="mt-3 px-4 py-2 bg-brand-coral-500 text-white rounded-md text-sm font-medium hover:bg-brand-coral-600 shadow-sm transition-colors"
            onClick={onRetry}
          >
            Retry
          </button>
        </div>
      ) : blogs.length > 0 ? (
        <div>
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={currentUser?._id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-brand-stone-500">No blog posts yet.</p>
          {isOwnProfile && (
            <button className="mt-3 px-4 py-2 bg-brand-coral-500 text-white rounded-md text-sm font-medium hover:bg-brand-coral-600 shadow-sm transition-colors">
              Create your first post
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileBlogs;
