import React, { useState, useRef } from 'react';
import { uploadImages } from '../../services/uploadImages';
import { useToast } from '../../hooks/use-toast';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (newImageUrl: string) => void;
  type: 'avatar' | 'cover';
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImageUrl,
  onImageUpdate,
  type,
  disabled = false,
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    try {
      const uploadedUrls = await uploadImages([file]);
      if (uploadedUrls && uploadedUrls.length > 0) {
        onImageUpdate(uploadedUrls[0]);
        setPreviewUrl('');
        // Reset the file input to allow re-uploading the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast({
          title: 'Upload Successful',
          description: `${type === 'avatar' ? 'Profile picture' : 'Cover image'} updated successfully.`,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
      setPreviewUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  if (type === 'avatar') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <img
            src={displayImageUrl || '/default-avatar.png'}
            alt="Profile Avatar"
            className={`w-24 h-24 rounded-full object-cover border-4 border-brand-coral-200 cursor-pointer transition-opacity ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'group-hover:opacity-75'
            }`}
            onClick={handleClick}
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {!disabled && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className="px-4 py-2 text-sm bg-brand-coral-500 text-white rounded-md hover:bg-brand-coral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Change Avatar'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-brand-stone-700">
        Cover Image
      </label>
      <div className="relative group">
        {displayImageUrl ? (
          <div className="relative">
            <img
              src={displayImageUrl}
              alt="Cover"
              className={`w-full h-32 object-cover rounded-lg border-2 border-gray-300 cursor-pointer transition-opacity ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'group-hover:opacity-75'
              }`}
              onClick={handleClick}
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {!disabled && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={`w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-coral-500 transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="text-center">
              <svg
                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-sm text-gray-500">
                Click to upload cover image
              </p>
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className="px-4 py-2 text-sm bg-brand-coral-500 text-white rounded-md hover:bg-brand-coral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading
          ? 'Uploading...'
          : displayImageUrl
            ? 'Change Cover Image'
            : 'Upload Cover Image'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
