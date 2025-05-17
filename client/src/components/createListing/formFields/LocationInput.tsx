import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  StandaloneSearchBox,
  useJsApiLoader,
  Libraries,
} from '@react-google-maps/api';
import { useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import formSchema from '@/components/createListing/formSchema';
import { ControllerRenderProps } from 'react-hook-form';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface LocationInputProps {
  field: ControllerRenderProps<z.infer<typeof formSchema>, "location">;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const LocationInput = ({ field, form }: LocationInputProps) => {
  // Load the Google Maps API
  const [libraries] = useState<Libraries>(['places', 'geometry']);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

  // Create a ref to hold the SearchBox instance
  const inputRef = useRef<google.maps.places.SearchBox | null>(null);

  // Handle the event when the user selects a place from the suggestions
  const handleOnPlacesChanged = () => {
    if (inputRef.current) {
      const places = inputRef.current.getPlaces();
      if (places && places.length > 0) {
        // only set the name and place_id of the selected place
        form.setValue('location', {
          name: places[0]?.name ?? '',
          place_id: places[0]?.place_id ?? '',
        });
      }
      console.log('Form location value:', form.getValues('location'));
    }
  };

  return (
    <FormItem className="mb-4">
      <FormLabel>Location</FormLabel>
      <FormControl>
        {isLoaded && (
          <StandaloneSearchBox
            onLoad={(ref) => {
              inputRef.current = ref;
            }}
            onPlacesChanged={handleOnPlacesChanged}
            {...field}
          >
            <Input
              placeholder="Search for a location"
              className="mb-4"
              onChange={(e) => {
                const value = e.target.value;
                field.onChange(value);
                // form.setValue('location', {
                //   ...form.watch('location'),
                //   name: value,
                // });
              }}
            />
          </StandaloneSearchBox>
        )}
      </FormControl>
      <FormDescription>Enter the location for your listing</FormDescription>
      <FormMessage />
    </FormItem>
  );
};

export default LocationInput;
