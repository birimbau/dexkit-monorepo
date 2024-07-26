import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { CheckoutFormType } from '../../types';

export const GET_ORDER_QUERY = 'GET_ORDER_QUERY';

export default function useOrder(params: { id?: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([GET_ORDER_QUERY, params], async () => {
    if (!instance) {
      throw new Error('no instance');
    }

    if (!params.id) {
      return null;
    }

    return (await instance.get<CheckoutFormType>(`/orders/${params.id}`)).data;
  });
}
