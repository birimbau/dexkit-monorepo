import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ProductCollectionType } from "../types";

export const GET_PRODUCT_COLLECTION_LIST = "GET_PRODUCT_COLLECTION_LIST";

export default function useProductCollectionList(params: {
  page: number;
  limit: number;
  q?: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_PRODUCT_COLLECTION_LIST, params],
    async () => {
      if (!instance) {
        throw new Error("no instance");
      }

      return (
        await instance.get<{
          items: ProductCollectionType[];
          totalItems: number;
          totalPages: number;
          currentPage: number;
        }>("/product-collections", { params })
      ).data;
    },
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      staleTime: 1000,
    }
  );
}
