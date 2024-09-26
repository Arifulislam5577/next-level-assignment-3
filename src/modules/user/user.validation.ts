import { z } from 'zod'

const createUserZodSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(4, { message: 'Name must be at least 4 characters' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email must be a valid email address' })
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
    .trim(),
  phone: z
    .string({ required_error: 'Phone Number is required' })
    .min(11, { message: 'Phone must be at least 11 characters' })
    .trim(),
  address: z.string({ required_error: 'Quantity is required' })
})

const loginUserZodSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Email must be a valid email address' })
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
    .trim()
})

export { createUserZodSchema, loginUserZodSchema }
