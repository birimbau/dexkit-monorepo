import { z } from "zod";
import { ProductCategorySchema } from "./schemas";

export type CommerceContextState = {
  productId?: string;
  setProduct: (productId?: string) => void;
  isSection?: boolean;
  cartItems: CartItem[];
  showCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  cart: {
    addItem: (params: {
      quantity: number;
      productId: string;
      name: string;
      price: string;
    }) => void;

    updateItem: (params: {
      quantity: number;
      productId: string;
      name: string;
      price: string;
    }) => void;

    item: (productId: string) => CartItem | undefined;
  };
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

export type CartItem = {
  quantity: number;
  productId: string;
  name: string;
  price: string;
};

export type CartState = {
  items: CartItem[];
};
