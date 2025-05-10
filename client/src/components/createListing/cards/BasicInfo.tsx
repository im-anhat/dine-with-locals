import { RefObject, useState } from 'react';

import { ImageIcon, XIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import formSchema from '@/components/createListing/formSchema';
import CategoryBadge from '../ui/CategoryBadge';

interface BasicInfoCardProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  fileInputRef: RefObject<HTMLInputElement | null> ;
}

const BasicInfoCard = ({ form, fileInputRef }: BasicInfoCardProps) => {
  const [topicInput, setTopicInput] = useState<string>('');

  const handleTopicRemove = (index: number) => {
    const updated = [...(form.watch('interestTopic') ?? [])];
    updated.splice(index, 1);
    form.setValue('interestTopic', updated);
  };

  const handleImageRemove = (index: number) => {
    const updated = [...(form.watch('images') ?? [])];
    updated.splice(index, 1);
    form.setValue('images', updated);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Fill in the details below to create your listing.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter listing title" {...field} />
              </FormControl>
              <FormDescription>
                Give your listing a catchy title (2-50 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dining">Dining</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the category that best fits your listing
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your listing"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description (10-500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel htmlFor="images">Images</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter image URL"
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files ?? []);
                    const updated = [...(field.value ?? []), ...newFiles];
                    field.onChange(updated); // correctly updates form state
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

        {/* Location */}
        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location ID" {...field} />
              </FormControl>
              <FormDescription>
                Enter the location ID for your listing
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Interest Topics */}
        <FormField
          control={form.control}
          name="interestTopic"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Interest Topics</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter interest topics"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // prevent form submit
                      const newTopic = topicInput.trim();
                      if (newTopic && !field.value?.includes(newTopic)) {
                        field.onChange([...(field.value ?? []), newTopic]);
                      }
                      setTopicInput('');
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Add interest topics separated by commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(form.watch('interestTopic') ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.watch('interestTopic')!.map((topic, index) => (
              <CategoryBadge
                key={index}
                onRemove={() => handleTopicRemove(index)}
              >
                {topic}
              </CategoryBadge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
