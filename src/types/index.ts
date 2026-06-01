export interface Collection {
  id: string; name: string; slug: string;
  description?: string | null; sort_order: number;
}
export interface ProductImage {
  id: string; product_id: string; image_url: string;
  alt_text?: string | null; sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color?: string | null;
  size?: string | null;
  price_inr: number;
  stock: number;
  images?: ProductVariantImage[];
}

export interface ProductVariantImage {
  id: string;
  variant_id: string;
  image_url: string;
  alt_text?: string | null;
  sort_order: number;
}

export interface Product {
  id: string; name: string; slug: string;
  short_description?: string | null; description?: string | null;
  price_inr: number; compare_at_price_inr?: number | null;
  status: string; featured: boolean;
  handmade_days_min?: number | null; handmade_days_max?: number | null;
  collection_id?: string | null;
  collection?: { name: string; slug: string } | null;
  images?: ProductImage[]; variants?: ProductVariant[];
  created_at: string; updated_at: string;
}
export interface Order {
  id: string; user_id?: string | null; order_number: string;
  status: string; payment_status: string;
  subtotal_inr: number; shipping_inr: number; discount_inr: number; total_inr: number;
  shipping_address: Record<string, string>;
  razorpay_order_id?: string | null; razorpay_payment_id?: string | null;
  created_at: string; updated_at: string;
  order_items?: OrderItem[];
}
export interface OrderItem {
  id: string; order_id: string; product_id?: string | null;
  product_variant_id?: string | null; product_name: string;
  variant_label?: string | null; quantity: number; price_inr: number;
}
export interface OrderEvent {
  id: string; order_id: string; label: string;
  details?: string | null; created_at: string;
}
export interface CustomOrder {
  id: string; user_id?: string | null; full_name: string;
  email: string; phone: string; category: string;
  budget_range?: string | null; notes: string;
  inspiration_urls?: string[] | null; status: string;
  quoted_price_inr?: number | null; admin_notes?: string | null;
  created_at: string;
}
export interface Review {
  id: string; product_id: string; user_id?: string | null;
  rating: number; title?: string | null; body: string;
  status: string; created_at: string;
  profiles?: { full_name?: string | null } | null;
  products?: { name: string } | null;
}
export interface Profile {
  id: string; email?: string | null; full_name?: string | null;
  phone?: string | null; avatar_url?: string | null; role: string;
}