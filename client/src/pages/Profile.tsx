import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getBlogsByUserId, BlogWithUser } from '../services/BlogService';
import { getUserById } from '../services/UserService';
import { getReviewsByUserId, Review } from '../services/ReviewService';
import { AuthenticatedUser } from '../../../shared/types/User';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Import modular components
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileAbout from '../components/profile/ProfileAbout';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileHobbies from '../components/profile/ProfileHobbies';
import ProfileReviews from '../components/profile/ProfileReviews';
import ProfileBlogs from '../components/profile/ProfileBlogs';

// interface ProfilePageProps {
//   userId?: string; // Optional: if not provided, will display current user's profile
// }

const ProfilePage = () => {
  const { currentUser } = useUser();
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState<AuthenticatedUser | null>(
    null,
  );
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<BlogWithUser[]>([]);
  const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState<boolean>(false);
  const { userId: paramUserId } = useParams<{ userId?: string }>();
  // fetch owner of the page
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (paramUserId || userId) {
          setIsOwnProfile(currentUser?._id === userId);

          // If not the current user, fetch the user data
          if (currentUser?._id !== userId) {
            const idToFetch = paramUserId ?? userId;
            if (idToFetch) {
              const userData = await getUserById(idToFetch);
              setProfileUser(userData);
            } else {
              throw new Error('No user ID provided');
            }
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
        // Could add toast notification here if needed
      }
    };

    fetchUserData();
  }, [paramUserId, userId, currentUser]);

  // fetch blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (profileUser?._id) {
        setBlogsLoading(true);
        setBlogsError(null);
        try {
          const userBlogs = await getBlogsByUserId(profileUser._id);
          setBlogs(userBlogs);
        } catch (error) {
          console.error('Failed to fetch blogs:', error);
          setBlogsError('Failed to fetch blogs. Please try again later.');
        } finally {
          setBlogsLoading(false);
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
        setReviewsLoading(true);
        try {
          const profileReviews = await getReviewsByUserId(profileUser._id);
          if (profileReviews) {
            setReviews(profileReviews);
          } else {
            setReviews([]);
          }
        } catch (error) {
          console.error('Failed to fetch reviews:', error);
          setReviews([]);
        } finally {
          setReviewsLoading(false);
        }
      } else {
        setReviews([]);
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [profileUser?._id]);

  const handleRetryFetchBlogs = () => {
    if (profileUser?._id) {
      setBlogsLoading(true);
      getBlogsByUserId(profileUser._id)
        .then((blogs) => {
          setBlogs(blogs);
          setBlogsError(null);
        })
        .catch((err) => {
          console.error('Error retrying blog fetch:', err);
          setBlogsError('Failed to fetch blogs. Please try again.');
        })
        .finally(() => setBlogsLoading(false));
    }
  };

  const handleUpdateBlogs = (updatedBlogs: BlogWithUser[]) => {
    setBlogs(updatedBlogs);
  };

  // Handle profile updates
  const handleProfileUpdate = (updatedUser: AuthenticatedUser) => {
    setProfileUser(updatedUser);
  };

  // Toggle all reviews modal
  const toggleAllReviewsModal = () => {
    setIsAllReviewsOpen((prev) => !prev);
  };

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
        {/* Profile Header Component */}
        <ProfileHeader
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Two-Column Layout for Profile Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - About, Stats, and Interests */}
          <div className="md:col-span-1 space-y-6">
            {/* About Section Component */}
            <ProfileAbout profileUser={profileUser} />

            {/* Stats Card Component */}
            <ProfileStats
              matchesCount={matches.length}
              blogsCount={blogs.length}
              reviewsCount={reviews.length}
            />

            {/* Hobbies & Interests Component */}
            <ProfileHobbies profileUser={profileUser} />
          </div>

          {/* Right Column - Reviews and Blog Posts */}
          <div className="md:col-span-2 space-y-6">
            {/* Reviews Section Component */}
            {reviewsLoading ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center py-4 text-brand-stone-500">
                  Loading reviews...
                </div>
              </div>
            ) : (
              <ProfileReviews
                reviews={reviews}
                isOwnProfile={isOwnProfile}
                profileFirstName={profileUser.firstName}
                isAllReviewsOpen={isAllReviewsOpen}
                onToggleAllReviews={toggleAllReviewsModal}
              />
            )}

            {/* Blog Posts Section Component */}
            <ProfileBlogs
              blogs={blogs}
              loading={blogsLoading}
              error={blogsError}
              isOwnProfile={isOwnProfile}
              profileFirstName={profileUser.firstName}
              onRetry={handleRetryFetchBlogs}
              onUpdateBlogs={handleUpdateBlogs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
