import { DexkitApiProvider } from '@dexkit/core/providers';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

const GET_USER_CHECKOUT_NETWORKS = 'GET_USER_CHECKOUT_NETWORKS';

export default function useUserCheckoutNetworks({ id }: { id: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [GET_USER_CHECKOUT_NETWORKS],
    async () => {
      if (!instance) {
        throw new Error('no instance');
      }

      return (
        await instance.get<number[]>(`/checkouts-networks/checkout/${id}`)
      ).data;
    },
    { refetchOnWindowFocus: true, refetchOnMount: true },
  );
}
