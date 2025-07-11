import { ChevronLeft } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import requestFormSchema from '@/components/createRequest/formSchema';
import BasicInfoCard from '@/components/createRequest/cards/BasicInfoCard';
import EventDetailsCard from '@/components/createRequest/cards/EventDetailsCard';
import DiningPreferencesCard from '@/components/createRequest/cards/DiningPreferencesCard';
import AdditionalInfoCard from '@/components/createRequest/cards/AdditionalInfoCard';
import { useNavigate } from 'react-router-dom';

const CreateRequest = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: '',
      locationType: 'either',
      locationId: '',
      interestTopic: [],
      time: undefined,
      cuisine: [],
      dietaryRestriction: [],
      numGuests: undefined,
      additionalInfo: '',
      status: 'waiting',
    },
  });

  const handleCreateRequest = async (
    values: z.infer<typeof requestFormSchema>,
  ) => {
    // Handle form submission
    console.log('Request Data:', values);

    // TODO: Add API call to create request

    // Reset the form after submission
    form.reset({
      title: '',
      locationType: 'either',
      locationId: '',
      interestTopic: [],
      time: undefined,
      cuisine: [],
      dietaryRestriction: [],
      numGuests: undefined,
      additionalInfo: '',
      status: 'waiting',
    });

    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col w-full p-4 bg-white">
      <nav className="flex items-center gap-4 p-4 bg-white">
        <ChevronLeft
          className="text-stone-500 hover:text-stone-900 hover:cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-semibold text-stone-900">
          Create a New Request
        </h1>
      </nav>

      {/* the form container */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateRequest)}
          className="space-y-8 py-4 md:px-32"
        >
          <BasicInfoCard form={form} />

          <EventDetailsCard form={form} />

          <DiningPreferencesCard form={form} />

          <AdditionalInfoCard form={form} />

          {/* Status - Hidden for UX purposes since it's typically managed by the system */}
          <input type="hidden" {...form.register('status')} value="waiting" />

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Create Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateRequest;
