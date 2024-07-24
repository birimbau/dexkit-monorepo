import { z } from 'zod';

export const ProductPriceSchema = z.object({
  id: z.string().optional(),
  chainId: z.number(),
  contractAddress: z.string(),
  amount: z.string(),
});

export const ProductSchema = (errMessage: string) =>
  z.object({
    id: z.string().optional(),
    name: z.string().max(30),
    prices: z.array(ProductPriceSchema).refine(
      (arg) => {
        const unique = new Set(
          arg.map((i) => `${i.chainId}-${i.contractAddress}`),
        );

        return unique.size === arg.length;
      },
      { message: errMessage },
    ),
  });

export const CheckoutSchemaItem = z.object({
  id: z.string().optional(),
  productId: z.string(),
  quantity: z.number(),
});

export const CheckoutSchema = z.object({
  name: z.string(),
  description: z.string(),
  requireEmail: z.boolean(),
  requireAccount: z.boolean(),
  items: z.array(CheckoutSchemaItem).min(1).max(50),
});
