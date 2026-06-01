import { create } from 'zustand';
import type { Product, ProductVariant } from '@/types';

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  price_inr: number;
}

interface CartState {
  items: CartItem[];

  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  addItem: (
    product: Product,
    variant?: ProductVariant | null,
    qty?: number
  ) => void;

  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;

  subtotal: () => number;
  shipping: () => number;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  isOpen: false,

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false }),

  addItem: (product, variant = null, qty = 1) =>
  set((state) => {
    const itemId = variant ? `${product.id}:${variant.id}` : product.id;

    const price =
  variant?.price_inr ??
  product.price_inr ??
  0;

    const existing = state.items.find((item) => item.id === itemId);

    if (existing) {
      return {
        items: state.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + qty }
            : item
        ),
        isOpen: true,
      };
    }

    return {
      items: [
        ...state.items,
        {
          id: itemId,
          product,
          variant,
          quantity: qty,
          price_inr: price,
        },
      ],
      isOpen: true,
    };
  }),

  removeItem: (id) =>
    set((s) => ({
      items: s.items.filter((i) => i.id !== id),
    })),

  updateQty: (id, qty) =>
    set((s) => ({
      items:
        qty < 1
          ? s.items.filter((i) => i.id !== id)
          : s.items.map((i) =>
              i.id === id ? { ...i, quantity: qty } : i
            ),
    })),

  clearCart: () => set({ items: [] }),

  subtotal: () =>
    get().items.reduce((a, i) => a + i.price_inr * i.quantity, 0),

  shipping: () => (get().subtotal() >= 599 ? 0 : 79),

  total: () => get().subtotal() + get().shipping(),

  count: () =>
    get().items.reduce((a, i) => a + i.quantity, 0),
}));