import { DexkitApiProvider } from '@dexkit/core/providers';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const USER_PAYMENT_METHODS = 'USER_PAYMENT_METHODS';

export function useUserPaymentMethods() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([USER_PAYMENT_METHODS], async () => {
    return (await instance?.get('/payments/methods'))?.data;
  });
}

export const USER_PLANS_QUERY = 'USER_PLANS_QUERY';

export function usePlanCheckoutMutation() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation([USER_PLANS_QUERY], async ({ plan }: { plan: string }) => {
    return (
      await instance?.get<{ url: string }>('/payments/checkout-session', {
        params: { plan },
      })
    )?.data;
  });
}

export const BILLING_HISTORY_QUERY = 'BILLING_HISTORY_QUERY';

export function useBillingHistoryQuery() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([BILLING_HISTORY_QUERY], async () => {
    return (await instance?.get('/payments/billing-history'))?.data;
  });
}

export const BILLING_QUERY = 'BILLING_QUERY';

export function useBillingQuery({ id }: { id: number }) {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery([BILLING_QUERY, id], async () => {
    return (await instance?.get(`/payments/billing/${id}`))?.data;
  });
}

export const BILLING_BY_FEAT_QUERY = 'BILLING_QUERY';

export function useBillingByFeatQuery({
  id,
  feat,
}: {
  id: number;
  feat: string;
}) {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery([BILLING_BY_FEAT_QUERY, id, feat], async () => {
    return (await instance?.get(`/payments/billing/${id}`))?.data;
  });
}
