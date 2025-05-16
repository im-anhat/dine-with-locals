import { RefObject, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
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
import ImageUploadField from '../formFields/ImageUploadField';

interface BasicInfoCardProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  fileInputRef: RefObject<HTMLInputElement | null>;
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

        <ImageUploadField
          form={form}
          fileInputRef={fileInputRef}
          handleImageRemove={handleImageRemove}
        />

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
                Add some topics you can talk about with your guests (press Enter
                to add)
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
