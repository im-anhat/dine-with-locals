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
import formSchema from '@/components/createListing/formSchema';

interface EventDetailsCardProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const EventDetailsCard = ({ form }: EventDetailsCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
        <CardDescription>
          Provide details about the event you are hosting.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Time */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Date & Time</FormLabel>
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
                When will this event take place?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Duration (hours)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Duration in hours"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>
              <FormDescription>How long will this event last?</FormDescription>
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
                  placeholder="Maximum number of guests"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Maximum number of guests you can accommodate
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fee */}
        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Compensation</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                />
              </FormControl>
              <FormDescription>
                Total compensation to the host (leave empty or 0 for free
                experience).
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
