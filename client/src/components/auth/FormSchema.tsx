import { z } from 'zod';
// Zod is a TypeScript-first schema declaration and validation library
//z.object is used to define a schema for an object
// It allows you to specify the structure and validation rules for the object
export const loginSchema = z.object({
  userName: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),
  password: z.string().min(1, 'Password is required'),
  // .min(6, 'Password must be at least 6 characters'),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  // ),
});

// TypeScript type for the login form data
// This will be inferred from the Zod schema
// It ensures that the data structure matches the validation schema
// This is useful for type safety in your application
export type LoginFormData = z.infer<typeof loginSchema>;

// Role schema
export const roleSchema = z.object({
  role: z.enum(['Host', 'Guest'], {
    required_error: 'Please select a role',
    invalid_type_error: 'Role must be either Host or Guest',
  }),
});

export const locationSchema = z.object({
  address: z
    .string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(100, 'Address must be less than 100 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters'),
  country: z
    .string()
    .min(1, 'Country is required')
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must be less than 50 characters'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(
      /^\d{5}(-\d{4})?$/,
      'ZIP code must be in format 12345 or 12345-6789',
    ),
});

// Personal information schema
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(30, 'First name must be less than 30 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(30, 'Last name must be less than 30 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(15, 'Phone number must be less than 15 characters'),
  // .regex(/^\+?[\d\s\-\(\)]{10,}$/, 'Please enter a valid phone number'),
});

export const baseAuthenticationSchema = z.object({
  userName: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(
      /^(?=.*[a-z])/,
      'Password must contain at least one lowercase letter',
    )
    .regex(
      /^(?=.*[A-Z])/,
      'Password must contain at least one uppercase letter',
    )
    .regex(/^(?=.*\d)/, 'Password must contain at least one number')
    .regex(
      /^(?=.*[@$!%*?&])/,
      'Password must contain at least one special character (@$!%*?&)',
    ),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
});

export const authenticationSchema = baseAuthenticationSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  },
);

export const completeSignupSchema = roleSchema
  .merge(personalInfoSchema)
  .merge(locationSchema)
  .merge(baseAuthenticationSchema) // Use base schema without refine
  .extend({
    locationId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export const step1Schema = roleSchema;
export const step2Schema = personalInfoSchema.merge(locationSchema).extend({
  locationId: z.string().optional(), // Optional field for location ID
});
export const step3Schema = authenticationSchema;

export type RoleFormData = z.infer<typeof roleSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type AuthenticationFormData = z.infer<typeof authenticationSchema>;
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type CompleteSignupFormData = z.infer<typeof completeSignupSchema>;
