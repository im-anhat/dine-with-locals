import { z } from 'zod';

const baseSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  imagesUrl: z.array(z.string().url()).nonempty(),
  locationId: z.string().nonempty(),
  interestTopic: z.array(z.string()).optional(),
  time: z.date().optional(),
  duration: z.number().positive().optional(),
  numGuests: z.number().positive().optional(),
  additionalInfo: z.string().optional(),
  status: z.enum(['pending', 'waiting', 'approved']),
});

// Dining-specific
const diningSchema = baseSchema.extend({
  category: z.literal('dining'),
  cuisine: z.array(z.string()).nonempty(),
  dietary: z.array(z.string()).nonempty(),
});

// Travel-specific
const travelSchema = baseSchema.extend({
  category: z.literal('travel'),
  // You can add travel-specific fields here
});

// Event-specific
const eventSchema = baseSchema.extend({
  category: z.literal('event'),
  // You can add event-specific fields here
});

// Discriminated union schema
const formSchema = z.discriminatedUnion('category', [
  diningSchema,
  travelSchema,
  eventSchema,
]);

export default formSchema;