import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().max(30),
  price: z.string(),
  imageUrl: z.string().url().optional(),
});

export const CheckoutSchemaItem = z.object({
  id: z.string().optional(),
  productId: z.string(),
  quantity: z.number(),
});

export const CheckoutSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  requireEmail: z.boolean(),
  requireAddress: z.boolean(),
  items: z.array(CheckoutSchemaItem).min(1).max(50),
});

export const CheckoutNetworksUpdateSchema = z.object({
  chainIds: z.array(z.number()),
});

export const CheckoutSettingsSchema = z.object({
  receiverAccount: z.string(),
  receiverEmail: z.string().email(),
});
