import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageIcon, XIcon } from 'lucide-react';

interface PostInputProps {
  onSubmit: (data: { title: string; content: string; photos: File[] }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialValues?: {
    title: string;
    content: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form when initialValues change (for editing mode)
  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setContent(initialValues.content);
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

    onSubmit({ title, content, photos });
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
        type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialValues ? 'Update' : 'Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostInput;
