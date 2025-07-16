import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import requestFormSchema from '@/components/createRequest/formSchema';

interface AdditionalInfoCardProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>;
}

const AdditionalInfoCard = ({ form }: AdditionalInfoCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormControl>
                <Textarea
                  placeholder="Any special requests or additional information?"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share any special requests, preferences, or additional details
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default AdditionalInfoCard;