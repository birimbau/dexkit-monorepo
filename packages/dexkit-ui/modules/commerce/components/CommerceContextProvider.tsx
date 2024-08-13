import { useState } from "react";
import { CommerceContext } from "../context";

export interface CommerceContextProviderProps {
  children: React.ReactNode;
}

export default function CommerceContextProvider({
  children,
}: CommerceContextProviderProps) {
  const [productId, setProductId] = useState<string>();
  const [isSection, setIsSection] = useState(false);

  const handleSetProduct = (productId?: string) => {
    setProductId(productId);
  };

  return (
    <CommerceContext.Provider
      value={{ productId, setProduct: handleSetProduct, isSection }}
    >
      {children}
    </CommerceContext.Provider>
  );
}
