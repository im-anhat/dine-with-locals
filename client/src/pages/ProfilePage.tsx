import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getBlogsByUserId, BlogWithUser } from '../services/BlogService';
import BlogPost from '../components/BlogPost';

// Dummy review data
const dummyReviews = [
  {
    id: 1,
    reviewer: 'im-anhat',
    rating: 5,
    content:
      'Great guest! Very respectful and engaging. Had amazing conversations about tech and science.',
    date: 'March 25, 2025',
  },
];

const ProfilePage: React.FC = () => {
  const { currentUser } = useUser();
  const [blogs, setBlogs] = useState<BlogWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (currentUser?._id) {
        setLoading(true);
        setError(null);
        try {
          const userBlogs = await getBlogsByUserId(currentUser._id);
          setBlogs(userBlogs);
        } catch (error) {
          console.error('Failed to fetch blogs:', error);
          setError('Failed to fetch blogs. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserBlogs();
  }, [currentUser?._id]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 overflow-y-auto bg-brand-shell/30">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-brand-purple to-brand-pink relative">
            <img
              src="https://images.template.net/wp-content/uploads/2014/11/Natural-Facebook-Cover-Photo.jpg"
              alt="Cover Photo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="px-6 py-4 relative">
            <div className="absolute -top-20 left-6">
              <img
                src={currentUser.avatar}
                alt={`${currentUser.firstName}'s avatar`}
                className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>
            <div className="mt-16 md:mt-0 md:ml-48">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {currentUser.firstName} {currentUser.lastName}
                    </h1>
                    <button className="ml-3 text-gray-600 hover:text-brand-purple transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    @{currentUser.userName}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-brand-pink/30 text-brand-purple rounded-full text-xs font-medium">
                      {currentUser.role}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {currentUser.ethnicity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout for Profile Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - About, Stats, and Interests */}
          <div className="md:col-span-1 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                About Me
              </h2>
              <p className="text-gray-600">{currentUser.bio}</p>

              <h3 className="text-md font-semibold text-gray-800 mt-6 mb-2">
                Contact
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-3 text-brand-purple/70"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  {currentUser.phone}
                </p>
                <p className="text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-3 text-brand-purple/70"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                  </svg>
                  <a
                    href={currentUser.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-purple hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Activity Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Matches</span>
                  <span className="bg-brand-purple/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                    2
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Host Requests</span>
                  <span className="bg-brand-pink text-white px-2 py-1 rounded-full text-xs font-medium">
                    1
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-600">Blog Posts</span>
                  <span className="bg-brand-orange text-white px-2 py-1 rounded-full text-xs font-medium">
                    {blogs.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reviews</span>
                  <span className="bg-brand-purple/80 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {dummyReviews.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Hobbies & Interests */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Hobbies & Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {currentUser.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-sm"
                  >
                    {hobby}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                  Preferred Cuisines
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-brand-pink/10 text-brand-pink rounded-full text-sm">
                    Thai
                  </span>
                  <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-sm">
                    Vietnamese
                  </span>
                  <span className="px-3 py-1 bg-brand-purple/10 text-brand-purple rounded-full text-sm">
                    Japanese
                  </span>
                  <span className="px-3 py-1 bg-brand-pink/10 text-brand-pink rounded-full text-sm">
                    Italian
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Reviews and Blog Posts */}
          <div className="md:col-span-2 space-y-6">
            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  What Others Are Saying
                </h2>
                <button className="text-sm text-brand-purple hover:underline">
                  Show more reviews
                </button>
              </div>

              <div className="space-y-6">
                {dummyReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">
                          @{review.reviewer}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-brand-pink'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Posts Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  My Blog Posts
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-8 bg-white rounded-lg shadow-md">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-purple"></div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-red-500">{error}</p>
                  <button
                    className="mt-3 px-4 py-2 bg-brand-purple text-white rounded-md text-sm font-medium hover:bg-brand-purple/90 transition-colors"
                    onClick={() => {
                      if (currentUser?._id) {
                        setLoading(true);
                        getBlogsByUserId(currentUser._id)
                          .then((blogs) => {
                            setBlogs(blogs);
                            setError(null);
                          })
                          .catch((err) => {
                            console.error('Error retrying blog fetch:', err);
                            setError(
                              'Failed to fetch blogs. Please try again.',
                            );
                          })
                          .finally(() => setLoading(false));
                      }
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : blogs.length > 0 ? (
                <div>
                  {blogs.map((blog) => (
                    <BlogPost key={blog._id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">No blog posts yet.</p>
                  <button className="mt-3 px-4 py-2 bg-brand-purple text-white rounded-md text-sm font-medium hover:bg-brand-purple/90 transition-colors">
                    Create your first post
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
