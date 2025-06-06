import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ImageIcon, XIcon } from 'lucide-react';

import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import formSchema from '@/components/createListing/formSchema';

interface ImageUploadFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageRemove: (index: number) => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ form, fileInputRef, handleImageRemove }) => (
  <>
    <FormField
      control={form.control}
      name="images"
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel htmlFor="images">Images</FormLabel>
          <FormControl>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files ?? []);
                const updated = [...(field.value ?? []), ...newFiles];
                field.onChange(updated);
              }}
            />
          </FormControl>
          <FormDescription>
            Upload images for your listing (max 5MB each)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button
      type="button"
      variant="outline"
      onClick={() => fileInputRef.current?.click()}
      className="w-full mb-4"
    >
      <ImageIcon className="h-4 w-4 mr-2" />
      Add Photos
    </Button>
    {(form.watch('images') ?? []).length > 0 && (
      <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
        {form.watch('images')!.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(photo)}
              alt={`Upload preview ${index + 1}`}
              className="w-full h-36 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => handleImageRemove(index)}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    )}
  </>
);
export default ImageUploadField;