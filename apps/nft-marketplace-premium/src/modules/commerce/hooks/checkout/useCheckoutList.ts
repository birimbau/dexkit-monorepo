import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { CheckoutFormType } from '../../types';

export const GET_CHECKOUT_LIST = 'GET_CHECKOUT_LIST';

export default function useCheckoutList(params: {
  page: number;
  limit: number;
  q?: string;
}) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_CHECKOUT_LIST, params], async () => {
    console.log('vem aqui');
    if (!instance) {
      throw new Error('no instance');
    }

    console.log('vem aqui2');

    return (
      await instance.get<{
        items: CheckoutFormType[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
      }>('/checkouts', { params })
    ).data;
  });
}
