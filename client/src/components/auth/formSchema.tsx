import { z } from 'zod';
import validator from 'validator';

//Define schema to represent types
const signupSchema = z.object({
  firstName: z.string().nonempty().max(50).min(2, 'Full first name must exist'),
  lastName: z.string().nonempty().max(50).min(2, 'Full last name must exist'),
  phoneNumber: z.string().max(12).min(10).refine(validator.isMobilePhone), //refine's used for custome validation
  address: z.string().max(50),
  city: z.string().max(50),
  state: z.string().max(50),
  zipCode: z.string().max(50),
  country: z.string().max(50),
});

const userNameSchema = z.object({
  userName: z.string().refine(async (userName) => {
    // verify that ID exists in database
    return true;
  }),
});

const passwordForm = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
  });
