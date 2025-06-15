import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  images: z.array(z.instanceof(File)).optional(),
  location: z.object({
    name: z.string(),
    place_id: z.string(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zipCode: z.string().optional(),
    coordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
  }),
  interestTopic: z.array(z.string()).optional(),
  time: z.date().optional(),
  duration: z.number().positive().optional(),
  numGuests: z.number().positive().optional(),
  additionalInfo: z.string().optional(),
  status: z.enum(['pending', 'waiting', 'approved']),

  // Category-specific fields
  category: z.enum(['dining', 'travel', 'event']),
  cuisine: z.array(z.string()).optional(),
  dietary: z.array(z.string()).optional(),
  // Add any other common fields here
});

export default formSchema;