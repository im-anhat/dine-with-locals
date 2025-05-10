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
import formSchema from '@/components/createListing/formSchema';

interface AdditionalInfoCardProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
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
              {/* <FormLabel>Additional Information</FormLabel> */}
              <FormControl>
                <Textarea
                  placeholder="Any other details guests should know?"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Add any other relevant information for your guests
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
