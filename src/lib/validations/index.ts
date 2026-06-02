import { z } from 'zod';

export const addressSchema = z.object({
  full_name:   z.string().min(2, 'Full name required'),
  phone:       z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian phone required'),
  line1:       z.string().min(5, 'Address required'),
  line2:       z.string().optional(),
  city:        z.string().min(2, 'City required'),
  state:       z.string().min(2, 'State required'),
  postal_code: z.string().regex(/^\d{6}$/, 'Valid 6-digit PIN required'),
  country:     z.string().default('IN'),
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
    ['bracelet', 'necklace', 'anklet', 'charm_piece', 'gift_set', 'other'],
    {
      required_error: 'Please choose a category',
      invalid_type_error: 'Please choose a category',
    }
  ),

  notes: z
    .string({
      required_error: 'Please describe your idea',
      invalid_type_error: 'Please describe your idea',
    })
    .trim()
    .min(10, { message: 'Please describe your idea in at least 10 characters' })
    .max(500, { message: 'Please keep your description under 500 characters' }),
});