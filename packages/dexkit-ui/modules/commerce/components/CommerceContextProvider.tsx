import { atomWithStorage, useReducerAtom } from "jotai/utils";
import { useState } from "react";
import { CommerceContext } from "../context";
import { CartState } from "../types";

export interface CommerceContextProviderProps {
  children: React.ReactNode;
}

export const dexkitCartAtom = atomWithStorage<CartState>(
  "dexkit.commerce.cart",
  {
    items: [],
  }
);

const ADD_CART_ITEM = "ADD_CART_ITEM";
const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";

type CartAddItem = {
  type: typeof ADD_CART_ITEM;
  quantity: number;
  productId: string;
  name: string;
  price: string;
};

type CartUpdateItem = {
  type: typeof UPDATE_CART_ITEM;
  quantity: number;
  productId: string;
  name: string;
  price: string;
};

type Action = CartAddItem | CartUpdateItem;

const reducer = (state: CartState = { items: [] }, action?: Action) => {
  switch (action?.type) {
    case ADD_CART_ITEM: {
      const newItems = [
        ...state.items,
        {
          name: action.name,
          price: action.price,
          productId: action.productId,
          quantity: action.quantity,
        },
      ];

      return { ...state, items: newItems };
    }

    case UPDATE_CART_ITEM: {
      const newItems = [...state.items];

      const index = newItems.findIndex((i) => i.productId === action.productId);

      if (index > -1) {
        if (action.quantity === 0) {
          newItems.splice(index, 1);
          return { ...state, items: newItems };
        }

        newItems[index] = {
          name: action.name,
          price: action.price,
          productId: action.productId,
          quantity: action.quantity,
        };
      }

      return { ...state, items: newItems };
    }
    default:
      return state;
  }
};

export default function CommerceContextProvider({
  children,
}: CommerceContextProviderProps) {
  const [productId, setProductId] = useState<string>();
  const [isSection, setIsSection] = useState(true);

  const [showCart, setShowCart] = useState(false);

  const [cart, dispatch] = useReducerAtom<CartState, Action>(
    dexkitCartAtom,
    reducer
  );

  const handleSetProduct = (productId?: string) => {
    setProductId(productId);
  };

  const addItem = (params: {
    quantity: number;
    productId: string;
    name: string;
    price: string;
  }) => {
    dispatch({ type: ADD_CART_ITEM, ...params });
  };

  const itemQuantity = (productId: string) => {
    return cart.items.find((i) => i.productId === productId);
  };

  const updateItem = (params: {
    quantity: number;
    productId: string;
    name: string;
    price: string;
  }) => {
    return dispatch({ type: UPDATE_CART_ITEM, ...params });
  };

  const openCart = () => {
    setShowCart(true);
  };

  const closeCart = () => {
    setShowCart(false);
  };

  return (
    <CommerceContext.Provider
      value={{
        productId,
        setProduct: handleSetProduct,
        isSection,
        showCart,
        openCart,
        closeCart,
        cartItems: cart.items,
        cart: {
          addItem,
          item: itemQuantity,
          updateItem,
        },
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
}
