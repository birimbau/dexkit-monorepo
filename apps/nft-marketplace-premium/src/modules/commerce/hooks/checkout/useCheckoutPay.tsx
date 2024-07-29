import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

export default function useCheckoutPay() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({
      id,
      hash,
      tokenAddress,
      chainId,
      senderEmail,
      senderAddress,
    }: {
      id: string;
      hash: string;
      tokenAddress: string;
      chainId: number;
      senderEmail: string;
      senderAddress: string;
    }) => {
      if (!instance) {
        throw new Error('no instance');
      }

      return await instance.post(`/checkouts/${id}/pay`, {
        hash,
        tokenAddress,
        chainId,
        senderAddress,
        senderEmail,
      });
    },
  );
}
