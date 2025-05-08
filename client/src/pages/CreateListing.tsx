import { ChevronLeft } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
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
} from "@/components/ui/select"
import formSchema from '@/components/createListing/formSchema';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CreateListing = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: 'dining',
      description: '',
      imagesUrl: [],
      locationId: '',
      interestTopic: [],
      time: undefined,
      duration: undefined,
      numGuests: undefined,
      additionalInfo: '',
      status: 'waiting',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Handle form submission
    console.log(values);
  };

  const category = form.watch('category');

  return (
    <div className="flex flex-col w-full p-4 bg-white">
      <nav className="flex items-center gap-4 p-4 bg-white">
        <ChevronLeft className="text-stone-500 hover:text-stone-900 hover:cursor-pointer" />
        <h1 className="text-xl font-semibold text-stone-900">
          Create a New Listing
        </h1>
      </nav>

      {/* the form container */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
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
                name="imagesUrl"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter image URL" 
                        // This is a simplified approach - ideally you'd have a component to add multiple URLs
                        onChange={(e) => {
                          const urlsArray = e.target.value.split(',').map(url => url.trim());
                          field.onChange(urlsArray);
                        }}
                        value={field.value.join(', ')}
                      />
                    </FormControl>
                    <FormDescription>
                      Add image URLs separated by commas
                    </FormDescription>
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
                        onChange={(e) => {
                          const topics = e.target.value.split(',').map(topic => topic.trim());
                          field.onChange(topics);
                        }}
                        value={field.value?.join(', ') || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Add interest topics separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            
          </Card>

          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Event Details</h2>

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
                        const date = e.target.value ? new Date(e.target.value) : undefined;
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
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    How long will this event last?
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
                      placeholder="Maximum number of guests"
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of guests you can accommodate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          {category === 'dining' && (
            <Card className="p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-4">Dining Specific</h2>
              
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
                        onChange={(e) => {
                          const cuisines = e.target.value.split(',').map(cuisine => cuisine.trim());
                          field.onChange(cuisines);
                        }}
                        value={field.value?.join(', ') || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      What cuisines will you be serving? (separate by commas)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        onChange={(e) => {
                          const options = e.target.value.split(',').map(option => option.trim());
                          field.onChange(options);
                        }}
                        value={field.value?.join(', ') || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Available dietary options (e.g., vegetarian, vegan, gluten-free)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          )}

          {/* Additional Info */}
          <Card className="p-6 shadow-sm">
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Additional Information</FormLabel>
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
          </Card>

          {/* Status - Hidden for UX purposes since it's typically managed by the system */}
          <input type="hidden" {...form.register('status')} value="waiting" />

          <div className="flex justify-end">
            <Button type="submit" className="px-8">Create Listing</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateListing;
