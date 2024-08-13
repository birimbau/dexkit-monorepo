import { z } from "zod";
import { ProductCategorySchema } from "./schemas";

export type CommerceContextState = {
  productId?: string;
  setProduct: (productId?: string) => void;
  isSection?: boolean;
};

export type ProductCategoryType = z.infer<typeof ProductCategorySchema>;

export type Product = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  price: string;
  imageUrl: string | null;
  owner: string;
};
