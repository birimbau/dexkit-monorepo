import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { ProductCategoryType } from "../types";

export const GET_CATEGORIES_BY_SITE = "GET_CATEGORIES_BY_SITE";

export default function useCategoriesBySite({ siteId }: { siteId: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_CATEGORIES_BY_SITE, siteId], async () => {
    if (!instance) {
      throw new Error("no instance");
    }

    return (
      await instance?.get<{
        items: ProductCategoryType[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
      }>(`/product-category/by-site/${siteId}`, {
        params: { page: 0, limit: 30 },
      })
    )?.data;
  });
}
