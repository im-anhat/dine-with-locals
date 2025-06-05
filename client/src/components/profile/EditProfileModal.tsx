import React, { useState, useEffect } from 'react';
import { AuthenticatedUser } from '../../../../shared/types/User';
import { updateUserProfile, UpdateUserData } from '../../services/UserService';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '../../hooks/use-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileUser: AuthenticatedUser;
  isOwnProfile: boolean;
  onProfileUpdate: (updatedUser: AuthenticatedUser) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profileUser,
  isOwnProfile,
  onProfileUpdate,
}) => {
  const { currentUser, setCurrentUser } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserData>({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: '',
    socialLink: '',
    role: 'Guest',
    hobbies: [],
    ethnicity: 'Other',
    bio: '',
    cover: '',
  });
  const [hobbyInput, setHobbyInput] = useState('');

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && profileUser) {
      setFormData({
        firstName: profileUser.firstName || '',
        lastName: profileUser.lastName || '',
        phone: profileUser.phone || '',
        avatar: profileUser.avatar || '',
        socialLink: profileUser.socialLink || '',
        role: profileUser.role || 'Guest',
        hobbies: profileUser.hobbies || [],
        ethnicity: profileUser.ethnicity || 'Other',
        bio: profileUser.bio || '',
        cover: profileUser.cover || '',
      });
    }
  }, [isOpen, profileUser]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddHobby = () => {
    if (hobbyInput.trim() && !formData.hobbies?.includes(hobbyInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...(prev.hobbies || []), hobbyInput.trim()],
      }));
      setHobbyInput('');
    }
  };

  const handleRemoveHobby = (hobbyToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies?.filter((hobby) => hobby !== hobbyToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwnProfile || !currentUser) return;

    setIsLoading(true);
    try {
      const updatedUser = await updateUserProfile(currentUser._id, formData);

      // Update the current user context if it's the current user's profile
      if (profileUser._id === currentUser._id) {
        setCurrentUser(updatedUser);
      }

      // Call the callback to update the profile page
      onProfileUpdate(updatedUser);

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-brand-stone-800">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={formData.avatar || profileUser.avatar}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-brand-coral-200"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-brand-stone-700 mb-2"
              >
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-brand-stone-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-brand-stone-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-brand-stone-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="socialLink"
                className="block text-sm font-medium text-brand-stone-700 mb-2"
              >
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="socialLink"
                name="socialLink"
                value={formData.socialLink}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          {/* Role and Ethnicity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-brand-stone-700 mb-2"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
              >
                <option value="Host">Host</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="ethnicity"
                className="block text-sm font-medium text-brand-stone-700 mb-2"
              >
                Ethnicity
              </label>
              <select
                id="ethnicity"
                name="ethnicity"
                value={formData.ethnicity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
              >
                <option value="Asian">Asian</option>
                <option value="Black">Black</option>
                <option value="Hispanic">Hispanic</option>
                <option value="White">White</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-brand-stone-700 mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Hobbies */}
          <div>
            <label className="block text-sm font-medium text-brand-stone-700 mb-2">
              Hobbies & Interests
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddHobby())
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
                placeholder="Add a hobby..."
              />
              <button
                type="button"
                onClick={handleAddHobby}
                className="px-4 py-2 bg-brand-coral-500 text-white rounded-md hover:bg-brand-coral-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.hobbies?.map((hobby, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-coral-100 text-brand-coral-700 border border-brand-coral-200"
                >
                  {hobby}
                  <button
                    type="button"
                    onClick={() => handleRemoveHobby(hobby)}
                    className="ml-2 text-brand-coral-500 hover:text-brand-coral-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label
              htmlFor="cover"
              className="block text-sm font-medium text-brand-stone-700 mb-2"
            >
              Cover Image URL
            </label>
            <input
              type="url"
              id="cover"
              name="cover"
              value={formData.cover}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-coral-500 focus:border-transparent"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-brand-stone-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isOwnProfile}
              className="px-6 py-2 bg-brand-coral-500 text-white rounded-md hover:bg-brand-coral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
