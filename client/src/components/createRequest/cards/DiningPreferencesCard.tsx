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
import requestFormSchema from '@/components/createRequest/formSchema';
import CategoryBadge from '@/components/createListing/ui/CategoryBadge';

interface DiningPreferencesCardProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>;
}

const DiningPreferencesCard = ({ form }: DiningPreferencesCardProps) => {
  const [cuisineInput, setCuisineInput] = useState<string>('');
  const [dietaryInput, setDietaryInput] = useState<string>('');

  const handleCategoryRemove = (
    index: number,
    fieldName: 'cuisine' | 'dietaryRestriction',
  ) => {
    const updated = [...(form.watch(fieldName) ?? [])];
    updated.splice(index, 1);
    form.setValue(fieldName, updated);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Dining Preferences</CardTitle>
        <CardDescription>
          Let us know about your food preferences and dietary restrictions.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Cuisine */}
        <FormField
          control={form.control}
          name="cuisine"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Preferred Cuisine</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter preferred cuisines"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const newCuisine = cuisineInput.trim();
                      if (newCuisine && !field.value?.includes(newCuisine)) {
                        field.onChange([...(field.value ?? []), newCuisine]);
                      }
                      setCuisineInput('');
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                What cuisines are you interested in? (press Enter to add)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(form.watch('cuisine') ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {form.watch('cuisine')!.map((cuisine, index) => (
              <CategoryBadge
                key={index}
                onRemove={() => handleCategoryRemove(index, 'cuisine')}
              >
                {cuisine}
              </CategoryBadge>
            ))}
          </div>
        )}

        {/* Dietary Restrictions */}
        <FormField
          control={form.control}
          name="dietaryRestriction"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Dietary Restrictions</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter dietary restrictions"
                  value={dietaryInput}
                  onChange={(e) => setDietaryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const newDietary = dietaryInput.trim();
                      if (newDietary && !field.value?.includes(newDietary)) {
                        field.onChange([...(field.value ?? []), newDietary]);
                      }
                      setDietaryInput('');
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                Any dietary restrictions or allergies? (press Enter to add)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(form.watch('dietaryRestriction') ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.watch('dietaryRestriction')!.map((restriction, index) => (
              <CategoryBadge
                key={index}
                onRemove={() => handleCategoryRemove(index, 'dietaryRestriction')}
              >
                {restriction}
              </CategoryBadge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiningPreferencesCard;