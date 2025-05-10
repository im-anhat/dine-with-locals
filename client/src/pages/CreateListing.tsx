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

const CreateListing = () => {
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      category: 'dining',
      description: '',
      images: [],
      locationId: '',
      interestTopic: [],
      time: undefined,
      duration: undefined,
      numGuests: undefined,
      additionalInfo: '',
      status: 'waiting',
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Handle form submission
    console.log(values);
    
    // Reset the form after submission
    form.reset({
      title: '',
      category: 'dining',
      description: '',
      images: [],
      locationId: '',
      interestTopic: [],
      time: undefined,
      duration: undefined,
      numGuests: undefined,
      additionalInfo: '',
      status: 'waiting',
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4 md:px-32">
          <BasicInfoCard form={form} fileInputRef={fileInputRef} />

          <EventDetailsCard form={form} />
          
          {category === 'dining' && <DiningSpecificCard form={form} />}
          
          <AdditionalInfoCard form={form} />
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
