import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getBlogsByUserId, BlogWithUser } from '../services/BlogService';
import BlogPost from '../components/BlogPost';
import { getUserById } from '../services/UserService';
import { getReviewsByUserId, Review } from '../services/ReviewService';
import { User } from '../../../shared/types/User';
import axios from 'axios';
import { get } from 'mongoose';

interface ProfilePageProps {
  userId?: string; // Optional: if not provided, will display current user's profile
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const { currentUser } = useUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<BlogWithUser[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const topThreeReviews = reviews.slice(0, 3); // we show only 3

  // fetch owner of the page
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (userId) {
          setIsOwnProfile(currentUser?._id === userId);

          // If not the current user, fetch the user data
          if (currentUser?._id !== userId) {
            const userData = await getUserById(userId);
            setProfileUser(userData);
          } else {
            // It's the current user's profile
            setProfileUser(currentUser);
          }
        } else {
          // No userId provided, show current user's profile
          setProfileUser(currentUser);
          setIsOwnProfile(true);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchUserData();
  }, [userId, currentUser]);

  // fetch blogs 
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (profileUser?._id) {
        setLoading(true);
        setError(null);
        try {
          const userBlogs = await getBlogsByUserId(profileUser._id);
          setBlogs(userBlogs);
        } catch (error) {
          console.error('Failed to fetch blogs:', error);
          setError('Failed to fetch blogs. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    if (profileUser) {
      fetchUserBlogs();
    }
  }, [profileUser?._id]);


  // Matches
  useEffect(() => {
    const fetchMatches = async () => {
      // Only fetch matches if profileUser._id is defined
      if (profileUser?._id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/'}api/matches/${profileUser._id}`,
          );
          setMatches(response.data);
        } catch (error) {
          console.error('Failed to fetch matches:', error);
          setMatches([]);
        }
      }
    };

    // Only call fetchMatches if profileUser exists
    if (profileUser?._id) {
      fetchMatches();
    }
  }, [profileUser?._id]);

  // fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (profileUser?._id) {
        const profileReviews = await getReviewsByUserId(profileUser._id);
        if (profileReviews) {
            setReviews(profileReviews);
        } else {
          setReviews([]);
        }
      } else {
        setReviews([]);
      }
    };

    fetchReviews();
  }, [profileUser?._id]);

  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-8 overflow-y-auto bg-brand-shell">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-brand-coral-500 to-brand-teal-400 relative">
            <img
              src="https://images.template.net/wp-content/uploads/2014/11/Natural-Facebook-Cover-Photo.jpg"
              alt="Cover Photo"
              className="w-full h-full object-cover opacity-85"
            />
          </div>

          {/* Profile Info */}
          <div className="px-6 py-4 relative">
            <div className="absolute -top-20 left-6">
              <img
                src={profileUser.avatar}
                alt={`${profileUser.firstName}'s avatar`}
                className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-md"
              />
            </div>
            <div className="mt-16 md:mt-0 md:ml-48">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-brand-stone-800">
                      {profileUser.firstName} {profileUser.lastName}
                    </h1>
                    {isOwnProfile && (
                      <button className="ml-3 text-brand-stone-500 hover:text-brand-coral-500 transition-colors">
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
                    )}
                  </div>
                  <p className="text-sm text-brand-stone-500">
                    @{profileUser.userName}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-brand-coral-100 text-brand-coral-700 rounded-full text-xs font-medium border border-brand-coral-200">
                      {profileUser.role}
                    </span>
                    <span className="px-3 py-1 bg-brand-stone-100 text-brand-stone-700 rounded-full text-xs font-medium border border-brand-stone-200">
                      {profileUser.ethnicity}
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
              <h2 className="text-lg font-semibold text-brand-coral-700 mb-4 border-b border-brand-coral-100 pb-2">
                About Me
              </h2>
              <p className="text-brand-stone-600">{profileUser.bio}</p>

              <h3 className="text-md font-semibold text-brand-coral-700 mt-6 mb-2 border-b border-brand-coral-100 pb-1">
                Contact
              </h3>
              <div className="space-y-2">
                <p className="text-brand-stone-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-3 text-brand-coral-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  {profileUser.phone}
                </p>
                <p className="text-brand-stone-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-3 text-brand-coral-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                  </svg>
                  <a
                    href={profileUser.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-coral-600 hover:text-brand-coral-700 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-brand-coral-700 mb-4 border-b border-brand-coral-100 pb-2">
                Activity Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-brand-stone-100 pb-3">
                  <span className="text-brand-stone-600">Matches</span>
                  <span className="bg-gradient-to-r from-brand-coral-400 to-brand-coral-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                    {matches.length}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-brand-stone-100 pb-3">
                  <span className="text-brand-stone-600">Blog Posts</span>
                  <span className="bg-gradient-to-r from-brand-coral-300 to-brand-coral-400 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                    {blogs.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-stone-600">Reviews</span>
                  <span className="bg-gradient-to-r from-brand-coral-400 to-brand-coral-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                   {reviews.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Hobbies & Interests */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-brand-coral-700 mb-4 border-b border-brand-coral-100 pb-2">
                Hobbies & Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {profileUser.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200 rounded-full text-sm"
                  >
                    {hobby}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-md font-semibold text-brand-coral-700 mb-3 border-b border-brand-coral-100 pb-1">
                  Preferred Cuisines
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 rounded-full text-sm">
                    Thai
                  </span>
                  <span className="px-3 py-1 bg-brand-orange-50 text-brand-orange-700 border border-brand-orange-200 rounded-full text-sm">
                    Vietnamese
                  </span>
                  <span className="px-3 py-1 bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200 rounded-full text-sm">
                    Japanese
                  </span>
                  <span className="px-3 py-1 bg-brand-teal-50 text-brand-teal-700 border border-brand-teal-200 rounded-full text-sm">
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
                <h2 className="text-lg font-semibold text-brand-coral-700 pb-1">
                  {isOwnProfile
                    ? 'What Others Are Saying'
                    : `Reviews for ${profileUser.firstName}`}
                </h2>
                <button className="text-sm text-brand-coral-600 hover:text-brand-coral-700 hover:underline">
                  Show more reviews
                </button>
              </div>

              <div className="space-y-6">
                {topThreeReviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-brand-stone-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-brand-stone-700">
                          @{review.reviewerId.userName}
                        </span>
                        <span className="mx-2 text-brand-stone-300">•</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-brand-coral-500'
                                  : 'text-brand-stone-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-brand-stone-500">
                      {new Date(review.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-brand-stone-600">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog Posts Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-brand-coral-700 pb-1">
                  {isOwnProfile
                    ? 'My Blog Posts'
                    : `${profileUser.firstName}'s Blog Posts`}
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
                    onClick={() => {
                      if (profileUser?._id) {
                        setLoading(true);
                        getBlogsByUserId(profileUser._id)
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
                  <p className="text-brand-stone-500">No blog posts yet.</p>
                  {isOwnProfile && (
                    <button className="mt-3 px-4 py-2 bg-brand-coral-500 text-white rounded-md text-sm font-medium hover:bg-brand-coral-600 shadow-sm transition-colors">
                      Create your first post
                    </button>
                  )}
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
