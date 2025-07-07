import { ChevronLeft } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import formSchema from '@/components/createListing/formSchema';
import { useRef } from 'react';
import BasicInfoCard from '@/components/createListing/cards/BasicInfo';
import EventDetailsCard from '@/components/createListing/cards/EventDetails';
import DiningSpecificCard from '@/components/createListing/cards/DiningSpecific';
import AdditionalInfoCard from '@/components/createListing/cards/AdditionalInfo';
import { useUser } from '@/contexts/UserContext';
import axios from 'axios';
import { uploadImages } from '@/services/uploadImages';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const CreateListing = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: 'dining',
      description: '',
      images: [],
      location: undefined,
      interestTopic: [],
      time: undefined,
      duration: undefined,
      numGuests: undefined,
      additionalInfo: '',
      status: 'waiting',
      fee: undefined,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentUser } = useUser();

  const handleCreateListing = async (values: z.infer<typeof formSchema>) => {
    // Handle form submission
    // Will probably need to check if the user is 1) a host and 2) logged in
    const listingData = { ...values, userId: currentUser?._id };
    console.log('Listing Data:', listingData);

    // Upload images to Cloudinary
    const imageUrls = values.images ? await uploadImages(values.images) : [];

    const finalListingData = {
      ...listingData,
      images: imageUrls,
    };
    console.log(
      'Final Listing Data with Images:',
      JSON.stringify(finalListingData, null, 2),
    );

    // Send the listing data to the server
    try {
      const response = await axios.post(`${API_URL}/listing`, finalListingData);
      console.log('Listing created successfully:', response.data);
    } catch (error) {
      console.error('Error creating listing:', error);
      // Handle error (e.g., show a notification)
      return;
    }

    // Reset the form after submission
    form.reset({
      title: '',
      category: 'dining',
      description: '',
      images: [],
      location: undefined,
      interestTopic: [],
      time: undefined,
      duration: undefined,
      numGuests: undefined,
      additionalInfo: '',
      status: 'waiting',
      fee: undefined,
    });

    // Reset file input if any
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        <form
          onSubmit={form.handleSubmit(handleCreateListing)}
          className="space-y-8 py-4 md:px-32"
        >
          <BasicInfoCard form={form} fileInputRef={fileInputRef} />

          <EventDetailsCard form={form} />

          {category === 'dining' && <DiningSpecificCard form={form} />}

          <AdditionalInfoCard form={form} />
          {/* Status - Hidden for UX purposes since it's typically managed by the system */}
          <input type="hidden" {...form.register('status')} value="waiting" />

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Create Listing
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateListing;
