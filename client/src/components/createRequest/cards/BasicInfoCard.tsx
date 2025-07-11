import { useState } from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import requestFormSchema from '@/components/createRequest/formSchema';
import CategoryBadge from '@/components/createListing/ui/CategoryBadge';

interface BasicInfoCardProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>;
}

const BasicInfoCard = ({ form }: BasicInfoCardProps) => {
  const [topicInput, setTopicInput] = useState<string>('');

  const handleTopicRemove = (index: number) => {
    const updated = [...(form.watch('interestTopic') ?? [])];
    updated.splice(index, 1);
    form.setValue('interestTopic', updated);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Tell us about your dining request.</CardDescription>
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
                <Input placeholder="Enter request title" {...field} />
              </FormControl>
              <FormDescription>
                Give your request a descriptive title (2-100 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Type */}
        <FormField
          control={form.control}
          name="locationType"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Location Preference</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Host's Home</SelectItem>
                    <SelectItem value="res">Restaurant</SelectItem>
                    <SelectItem value="either">Either</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Where would you prefer to dine?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormDescription>
                Specify the area where you'd like to dine
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
                      e.preventDefault();
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
                What topics would you like to discuss? (press Enter to add)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(form.watch('interestTopic') ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(form.watch('interestTopic') ?? []).map(
              (topic: string, index: number) => (
                <CategoryBadge
                  key={index}
                  onRemove={() => handleTopicRemove(index)}
                >
                  {topic}
                </CategoryBadge>
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
