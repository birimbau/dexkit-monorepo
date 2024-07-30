import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ProductFormType } from '../types';

export const GET_PRODUCT_LIST = 'GET_PRODUCT_LIST';

export default function useProductList(params: {
  page: number;
  limit: number;
  q?: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_PRODUCT_LIST, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      return (
        await instance.get<{
          items: ProductFormType[];
          totalItems: number;
          totalPages: number;
          currentPage: number;
        }>('/products', { params })
      ).data;
    },
    { refetchOnWindowFocus: true },
  );
}
