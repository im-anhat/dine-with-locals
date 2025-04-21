import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ImageIcon } from "lucide-react";
import { Blog } from "../../../shared/types/Blog";

interface PostInputProps {
  onSubmit: (data: { title: string; content: string; photos: File[] }) => void;
  onCancel: () => void;
}

const PostInput: React.FC<PostInputProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPhotos([...photos, ...newFiles]);
      
      // Create preview URLs for the new photos
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPhotoPreviewUrls([...photoPreviewUrls, ...newPreviewUrls]);
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);

    const updatedPreviewUrls = [...photoPreviewUrls];
    URL.revokeObjectURL(updatedPreviewUrls[index]); // Clean up URL object
    updatedPreviewUrls.splice(index, 1);
    setPhotoPreviewUrls(updatedPreviewUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, photos });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Title of your post"
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      
      <div>
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={handleContentChange}
          className="min-h-[120px]"
        />
      </div>

      {photoPreviewUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {photoPreviewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img 
                src={url} 
                alt={`Preview ${index}`} 
                className="h-24 w-full object-cover rounded"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                onClick={() => removePhoto(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <div>
          <label htmlFor="photo-upload" className="cursor-pointer">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm">
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Photos
              </Button>
            </div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>
        
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Post</Button>
        </div>
      </div>
    </form>
  );
};

export default PostInput;