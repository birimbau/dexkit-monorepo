import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';
import { ProductFormType } from '../types';

export default function useProductList() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (params: { page: number; limit: number }) => {
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
  });
}
