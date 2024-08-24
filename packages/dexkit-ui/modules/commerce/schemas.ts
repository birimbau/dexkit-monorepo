import { z } from "zod";

export const ProductCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

export const CartOrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export const CartOrderSchema = z.object({
  siteId: z.number(),
  email: z.string().email().nullable().optional(),
  sender: z.string(),
  chainId: z.number(),
  hash: z.string(),
  tokenAddress: z.string(),
  items: z.array(CartOrderItemSchema),
});

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().max(30),
  price: z.string(),
  category: z
    .custom<z.infer<typeof CategoryFormSchema>>()
    .nullable()
    .optional(),
  imageUrl: z.string().url().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
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
  editable: z.boolean().default(false),
});

export const CheckoutNetworksUpdateSchema = z.object({
  chainIds: z.array(z.number()),
});

export const CheckoutSettingsSchema = z.object({
  receiverAccount: z.string(),
  receiverEmail: z.string().email(),
});

export const UserCheckoutItemsFormSchema = z.object({
  items: z.record(
    z.object({
      quantity: z.number().min(1).max(100),
      price: z.string(),
    })
  ),
});

export const CategoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
});

export const CollectionItemSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
});

export const ProductCollectionSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  items: z.array(CollectionItemSchema).optional(),
});
