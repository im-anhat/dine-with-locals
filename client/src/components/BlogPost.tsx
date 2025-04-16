import React from 'react';
import { format } from 'date-fns';
import { BlogWithUser } from '../services/BlogService';

interface BlogPostProps {
  blog: BlogWithUser;
}

const BlogPost: React.FC<BlogPostProps> = ({ blog }) => {
  // Format date to display as "Month day, year"
  const formattedDate = blog.createdAt
    ? format(new Date(blog.createdAt), 'MMM d, yyyy')
    : '';

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex">
          <img
            src={blog.userId.avatar}
            alt={`${blog.userId.firstName} ${blog.userId.lastName}`}
            className="w-12 h-12 rounded-full object-cover border border-gray-100"
          />
          <div className="ml-3">
            <div className="font-medium text-gray-800">
              {blog.userId.firstName} {blog.userId.lastName}
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <span>@{blog.userId.userName}</span>
              <span className="mx-1">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <h3 className="font-semibold text-lg mb-1">{blog.blogTitle}</h3>
        <p className="text-gray-700 mb-3">{blog.blogContent}</p>
      </div>

      {/* Post Images */}
      {blog.photos && blog.photos.length > 0 && (
        <div className="flex">
          {blog.photos.map((photo, index) => (
            <div
              key={index}
              className={`${blog.photos.length > 1 ? 'w-1/2' : 'w-full'}`}
            >
              <img
                src={photo}
                alt={`Blog image ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex justify-between">
        <div className="flex space-x-6">
          <button className="flex items-center text-gray-600 hover:text-brand-pink">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm">Like</span>
          </button>
          <button className="flex items-center text-gray-600 hover:text-brand-purple">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm">Comment</span>
          </button>
          <button className="flex items-center text-gray-600 hover:text-brand-orange">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="text-sm">Share</span>
          </button>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span>925 likes</span>
          <span className="mx-2">•</span>
          <span>23 comments</span>
        </div>
      </div>

      {/* Comment Input */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center">
        <img
          src={blog.userId.avatar}
          alt="Current user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-grow mx-2 relative">
          <input
            type="text"
            placeholder="Add a comment..."
            className="bg-gray-100 rounded-full py-2 px-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brand-purple">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
