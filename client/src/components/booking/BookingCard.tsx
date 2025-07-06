import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField } from '@/components/ui/form';
import { BookingFormValues } from '@/components/booking/FormSchema';

interface BookingCardProps {
  form: UseFormReturn<BookingFormValues>;
  onSubmitForm: (values: BookingFormValues) => void;
  disabled?: boolean;
}

const BookingCard = ({ form, onSubmitForm, disabled }: BookingCardProps) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
          {/* Additional Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Additional details for the host</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="additionalDetails"
                render={({ field }) => (
                  <Textarea
                    placeholder="E.g. Number of people in your trip, expected time of arrival, dietary restrictions, etc."
                    className="resize-none"
                    {...field}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Host Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>What your host should know</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="hostInfo"
                render={({ field }) => (
                  <Textarea
                    placeholder="Share any important information your host should know"
                    className="resize-none"
                    {...field}
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <div>
                    <p className="font-medium">American Express</p>
                    <p className="text-gray-500">Ends in 6677</p>
                  </div>
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full">
                + Add new card
              </Button>
              <p className="text-gray-600">
                We will not charge until the experience has happened. If the
                host declines your request, no charge will occur.
              </p>
            </CardContent>
          </Card>

          {/* Notice Card */}
          <Card>
            <CardHeader>
              <CardTitle>Notice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                By clicking "Request", the host can view your information. It
                does not guarantee the experience unless the host approved your
                request. The host can reject your request.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked === true)}
                />
                <label htmlFor="confirm" className="font-medium">
                  I confirm the above
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Request Button */}
          <Button
            className="w-full h-12 text-lg"
            disabled={!confirmed || disabled}
            type="submit"
            onClick={() => {
              if (!confirmed) {
                alert('Please confirm the details before proceeding.');
              }
            }}
          >
            Request to Book
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BookingCard;
