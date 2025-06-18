import React, { useState, useEffect } from 'react';
import { AuthenticatedUser } from '../../../../shared/types/User';
import { updateUserProfile, UpdateUserData } from '../../services/UserService';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '../../hooks/use-toast';
import TagSelector from '../ui/TagSelector';
import ImageUpload from '../ui/ImageUpload';
import {
  PREDEFINED_HOBBIES,
  PREDEFINED_CUISINES,
} from '../../constants/predefines';

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
    hobbies: [],
    cuisines: [],
    ethnicity: 'Other',
    bio: '',
    cover: '',
  });

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && profileUser) {
      setFormData({
        firstName: profileUser.firstName || '',
        lastName: profileUser.lastName || '',
        phone: profileUser.phone || '',
        avatar: profileUser.avatar || '',
        hobbies: profileUser.hobbies || [],
        cuisines: profileUser.cuisines || [],
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
          <ImageUpload
            currentImageUrl={formData.avatar}
            onImageUpdate={(newImageUrl) =>
              setFormData((prev) => ({ ...prev, avatar: newImageUrl }))
            }
            type="avatar"
            disabled={!isOwnProfile}
          />

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
          <div className="grid grid-cols-1 gap-4">
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
          </div>

          {/* Ethnicity */}
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

          {/* Hobbies & Interests */}
          <TagSelector
            label="Hobbies & Interests"
            selectedTags={formData.hobbies || []}
            onTagsChange={(hobbies) =>
              setFormData((prev) => ({ ...prev, hobbies }))
            }
            predefinedOptions={PREDEFINED_HOBBIES}
            placeholder="Type to search hobbies..."
            disabled={!isOwnProfile}
          />

          {/* Cuisines */}
          <TagSelector
            label="Preferred Cuisines"
            selectedTags={formData.cuisines || []}
            onTagsChange={(cuisines) =>
              setFormData((prev) => ({ ...prev, cuisines }))
            }
            predefinedOptions={PREDEFINED_CUISINES}
            placeholder="Type to search cuisines..."
            disabled={!isOwnProfile}
          />

          {/* Cover Image */}
          <ImageUpload
            currentImageUrl={formData.cover}
            onImageUpdate={(newImageUrl) =>
              setFormData((prev) => ({ ...prev, cover: newImageUrl }))
            }
            type="cover"
            disabled={!isOwnProfile}
          />

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
