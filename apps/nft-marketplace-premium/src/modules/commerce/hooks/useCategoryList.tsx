import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { CategoryType } from '../types';

export const GET_CATEGORY_LIST = 'GET_CATEGORY_LIST';

export default function useCategoryList(params: {
  page: number;
  limit: number;
  q?: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_CATEGORY_LIST, params],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      return (
        await instance.get<{
          items: CategoryType[];
          totalItems: number;
          totalPages: number;
          currentPage: number;
        }>('/product-category', { params })
      ).data;
    },
    {
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      staleTime: 1000,
    },
  );
}
