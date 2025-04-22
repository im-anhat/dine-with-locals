import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface PostInputProps {
  onSubmit: (data: { title: string; content: string; }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PostInput: React.FC<PostInputProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({ title: "", content: "" });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value) {
      setErrors(prev => ({ ...prev, title: "" }));
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value) {
      setErrors(prev => ({ ...prev, content: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      content: ""
    };
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!content.trim()) {
      newErrors.content = "Content is required";
    }
    
    setErrors(newErrors);
    return !newErrors.title && !newErrors.content;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Title of your post"
          value={title}
          onChange={handleTitleChange}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      
      <div>
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={handleContentChange}
          className={`min-h-[120px] ${errors.content ? "border-red-500" : ""}`}
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      </div>

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
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};

export default PostInput;