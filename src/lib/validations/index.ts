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

export const customOrderSchema = z.object({
  full_name:        z.string().min(2),
  email:            z.string().email(),
  phone:            z.string().regex(/^[6-9]\d{9}$/),
  category:         z.enum(['bracelet','charm','necklace','earrings','other']),
  budget_range:     z.string().optional(),
  notes:            z.string().min(10),
  inspiration_urls: z.array(z.string().url()).optional(),
});

export const reviewSchema = z.object({
  product_id: z.string().uuid(),
  rating:     z.number().int().min(1).max(5),
  title:      z.string().optional(),
  body:       z.string().min(10),
});