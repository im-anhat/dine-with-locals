import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageIcon, XIcon, MapPin } from 'lucide-react';
import { getMatchedListingsByUserId } from '../services/MatchService';
import { useUserContext } from '../hooks/useUserContext';
import { Listing } from '../../../shared/types/Listing';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface PostInputProps {
  onSubmit: (data: {
    title: string;
    content: string;
    photos: File[];
    listingId?: string;
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialValues?: {
    title: string;
    content: string;
    listingId?: string;
  };
}

const PostInput: React.FC<PostInputProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialValues,
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [matchedListings, setMatchedListings] = useState<Listing[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<
    string | undefined
  >(initialValues?.listingId);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useUserContext();

  // Fetch matched listings when component mounts
  useEffect(() => {
    const fetchMatchedListings = async () => {
      if (!currentUser?._id) return;

      setIsLoadingListings(true);
      try {
        const listings = await getMatchedListingsByUserId(currentUser._id);
        setMatchedListings(listings);
      } catch (error) {
        console.error('Failed to fetch matched listings:', error);
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchMatchedListings();
  }, [currentUser?._id]);

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setContent(initialValues.content);
      setSelectedListingId(initialValues.listingId);
    }
  }, [initialValues]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value) {
      setErrors((prev) => ({ ...prev, content: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleListingChange = (value: string) => {
    // If value is "none" or not valid, set to undefined
    if (value === 'none') {
      setSelectedListingId(undefined);
      return;
    }

    // Verify the listingId is a valid MongoDB ObjectId
    if (value && /^[0-9a-fA-F]{24}$/.test(value)) {
      console.log('Setting valid listing ID:', value);
      setSelectedListingId(value);
    } else {
      console.warn('Invalid listing ID format detected:', value);
      setSelectedListingId(undefined);
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: '',
      content: '',
    };

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.content;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({ title, content, photos, listingId: selectedListingId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Title of your post"
          value={title}
          onChange={handleTitleChange}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={handleContentChange}
          className={`min-h-[120px] ${errors.content ? 'border-red-500' : ''}`}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          Link To Experience
        </label>
        <Select value={selectedListingId} onValueChange={handleListingChange}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                isLoadingListings
                  ? 'Loading listings...'
                  : 'Select an experience'
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Your matched experiences</SelectLabel>
              {matchedListings.length === 0 && !isLoadingListings && (
                <SelectItem value="none" disabled>
                  No matched experiences found
                </SelectItem>
              )}
              {matchedListings.map((listing) => (
                <SelectItem key={listing._id} value={listing._id}>
                  {listing.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleClickUpload}
          className="w-full bg-brand-coral-300"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {initialValues ? 'Change Photos' : 'Add Photos'}
        </Button>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Upload preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemovePhoto(index)}
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          className="bg-brand-coral-300"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : initialValues ? 'Update' : 'Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostInput;
