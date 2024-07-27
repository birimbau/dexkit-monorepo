import { z } from 'zod';
import {
  CheckoutNetworksUpdateSchema,
  CheckoutSchema,
  CheckoutSchemaItem,
  CheckoutSettingsSchema,
  ProductSchema,
} from '../schemas';

export type ProductFormType = z.infer<typeof ProductSchema>;

export type CheckoutFormType = z.infer<typeof CheckoutSchema>;
export type CheckoutItemType = z.infer<typeof CheckoutSchemaItem>;

export type CheckoutNetworksUpdateType = z.infer<
  typeof CheckoutNetworksUpdateSchema
>;

export type CheckoutSettingsType = z.infer<typeof CheckoutSettingsSchema>;

export type CheckoutItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  checkoutId: string;
  productId: string;
  price: string;
  quantity: number;
  description: string;
  active: boolean;
};

export type Checkout = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  requireEmail: boolean;
  requireAddress: boolean;
  owner: string;
  items: CheckoutItem[];
};
