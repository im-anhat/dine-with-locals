import { useState } from 'react';
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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import formSchema from '@/components/createListing/formSchema';
import CategoryBadge from '../ui/CategoryBadge';

interface DiningSpecificCardProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const DiningSpecificCard = ({ form }: DiningSpecificCardProps) => {
  const [cuisineInput, setCuisineInput] = useState<string>('');
  const [dietaryInput, setDietaryInput] = useState<string>('');

  const handleCategoryRemove = (
    index: number,
    fieldName: 'cuisine' | 'dietary',
  ) => {
    const updated = [...(form.watch(fieldName) ?? [])];
    updated.splice(index, 1);
    form.setValue(fieldName, updated);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Dining-specific Information</CardTitle>
        <CardDescription>
          Please provide details about the dining experience you are offering.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Cuisine */}
        <FormField
          control={form.control}
          name="cuisine"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Cuisine</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter cuisines"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // prevent form submit
                      const newTopic = cuisineInput.trim();
                      if (newTopic && !field.value?.includes(newTopic)) {
                        field.onChange([...(field.value ?? []), newTopic]);
                      }
                      setCuisineInput('');
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                What cuisines will you be serving?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(form.watch('cuisine') ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.watch('cuisine')!.map((topic, index) => (
              <CategoryBadge
                key={index}
                onRemove={() => handleCategoryRemove(index, 'cuisine')}
              >
                {topic}
              </CategoryBadge>
            ))}
          </div>
        )}

        {/* Dietary */}
        <FormField
          control={form.control}
          name="dietary"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Dietary Options</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter dietary options"
                  value={dietaryInput}
                  onChange={(e) => setDietaryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // prevent form submit
                      const newTopic = dietaryInput.trim();
                      if (newTopic && !field.value?.includes(newTopic)) {
                        field.onChange([...(field.value ?? []), newTopic]);
                      }
                      setDietaryInput('');
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Available dietary options (e.g., vegetarian, vegan, gluten-free)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(form.watch('dietary') ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.watch('dietary')!.map((topic, index) => (
              <CategoryBadge
                key={index}
                onRemove={() => handleCategoryRemove(index, 'dietary')}
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

export default DiningSpecificCard;
