import { ChainId } from '@dexkit/core';
import { z } from 'zod';
import { CheckoutSchema, CheckoutSchemaItem } from '../schemas';

export type ProductPriceType = {
  contractAddress: string;
  chainId: ChainId;
  amount: string;
  id?: string;
};

export type ProductFormType = {
  id?: string;
  name: string;
  prices: ProductPriceType[];
};

export type CheckoutFormType = z.infer<typeof CheckoutSchema>;
export type CheckoutItemType = z.infer<typeof CheckoutSchemaItem>;
