import { z } from 'zod';

export const addressSchema = z.object({
  full_name: z.string().trim().min(2, 'Please enter your full name'),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  line1: z.string().trim().min(5, 'Please enter your address'),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, 'Please enter your city'),
  state: z.string().trim().min(2, 'Please select your state'),
  postal_code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Please enter a valid 6-digit PIN code'),
  country: z.string().default('IN'),
});


export const reviewSchema = z.object({
  product_id: z.string().uuid(),
  rating:     z.number().int().min(1).max(5),
  title:      z.string().optional(),
  body:       z.string().min(10),
});

export const customOrderSchema = z.object({
  full_name: z
    .string({
      required_error: 'Please enter your full name',
      invalid_type_error: 'Please enter your full name',
    })
    .trim()
    .min(2, { message: 'Please enter your full name' }),

  email: z
    .string({
      required_error: 'Please enter your email address',
      invalid_type_error: 'Please enter your email address',
    })
    .trim()
    .min(1, { message: 'Please enter your email address' })
    .email({ message: 'Please enter a valid email address' }),

  phone: z
    .string({
      required_error: 'Please enter your phone number',
      invalid_type_error: 'Please enter your phone number',
    })
    .trim()
    .min(1, { message: 'Please enter your phone number' })
    .regex(/^[0-9]{10,15}$/, { message: 'Please enter a valid phone number' }),

  category: z.enum(
    ['bracelet', 'necklace', 'anklet','earrings', 'charm', 'gift_set', 'other'],
    {
      required_error: 'Please choose a category',
      invalid_type_error: 'Please choose a category',
    }
  ),

   budget_range: z
    .string()
    .trim()
    .optional(),

  inspiration_urls: z
    .string()
    .trim()
    .optional(),

  notes: z
    .string({
      required_error: 'Please describe your idea',
      invalid_type_error: 'Please describe your idea',
    })
    .trim()
    .min(10, { message: 'Please describe your idea in at least 10 characters' })
    .max(500, { message: 'Please keep your description under 500 characters' }),
});