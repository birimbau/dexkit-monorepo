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
  email: z.string().email(),
  sender: z.string(),
  chainId: z.number(),
  hash: z.string(),
  tokenAddress: z.string(),
  items: z.array(CartOrderItemSchema),
});
