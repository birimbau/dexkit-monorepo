import { z } from "zod";
import {
  CartOrderSchema,
  CategoryFormSchema,
  CheckoutNetworksUpdateSchema,
  CheckoutSchema,
  CheckoutSchemaItem,
  CheckoutSettingsSchema,
  CollectionItemSchema,
  ProductCategorySchema,
  ProductCollectionSchema,
  ProductSchema,
} from "./schemas";

export type CommerceContextState = {
  productId?: string;
  setProduct: (productId?: string) => void;
  isSection?: boolean;
  cartItems: CartItem[];
  requireEmail: boolean;
  showCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  checkCart: () => Promise<void>;
  cart: {
    addItem: (params: {
      quantity: number;
      productId: string;
      name: string;
      price: string;
      imageUrl?: string;
    }) => void;

    updateItem: (params: {
      quantity: number;
      productId: string;
      name: string;
      price: string;
      imageUrl?: string;
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
} & { category?: { id: string; name: string } };

export type CartItem = {
  quantity: number;
  productId: string;
  name: string;
  price: string;
  imageUrl?: string;
};

export type CartState = {
  items: CartItem[];
};

export type CartOrderType = z.infer<typeof CartOrderSchema>;

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
  product?: Product;
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
  editable: boolean;
  items: CheckoutItem[];
};

export type Order = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: any;
  chainId: number;
  contractAddress: string;
  amount: string;
  hash: string;
  receiver: string;
  receiverEmail: string;
  notificationEmail: string;
  senderAddress: string;
  email: string | null;
  owner: string;
  status: string;
};

export type OrderItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  orderId: string;
  quantity: number;
  price: string;
  productId: string;
  metadata: any;
};

export type CategoryType = z.infer<typeof CategoryFormSchema>;

export type ProductCollectionItemType = z.infer<typeof CollectionItemSchema>;

export type ProductCollectionType = z.infer<typeof ProductCollectionSchema>;
