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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import requestFormSchema from '@/components/createRequest/formSchema';

interface EventDetailsCardProps {
  form: UseFormReturn<z.infer<typeof requestFormSchema>>;
}

const EventDetailsCard = ({ form }: EventDetailsCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
        <CardDescription>
          When and how many people will be joining?
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Time */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Preferred Date & Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : undefined;
                    field.onChange(date);
                  }}
                />
              </FormControl>
              <FormDescription>
                When would you like to dine?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number of Guests */}
        <FormField
          control={form.control}
          name="numGuests"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Number of Guests</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Number of guests"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                How many people will be dining?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default EventDetailsCard;