import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { FeatUsage, Subscription } from "../types/ai";
import { CreditGrant, CryptoCheckoutSession } from "../types/payments";

export const SUBSCRIPTION_QUERY = "SUBSCRIPTION_QUERY";

export function useSubscription() {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<Subscription>(
    [SUBSCRIPTION_QUERY],
    async () => {
      return (await instance?.get("/payments/subscription"))?.data;
    },
    { refetchInterval: 5000 }
  );
}

export function useBuyCreditsCheckout() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ amount }: { amount: number }) => {
    return (
      await instance?.post<{ url: string }>("/payments/buy-credits-session", {
        amount: amount.toString(),
      })
    )?.data;
  });
}

export const CREDIT_HISTORY = "CREDIT_HISTORY";

export function useCreditHistory() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([CREDIT_HISTORY], async () => {
    return (await instance?.get<CreditGrant[]>("/payments/credit-history"))
      ?.data;
  });
}

export function useCryptoCheckout() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (params: { intent: string; amount: string }) => {
    return (
      await instance?.post<CryptoCheckoutSession>(
        "/payments/crypto-checkout-session",
        params
      )
    )?.data;
  });
}

export const CRYPTO_CHECKOUT_ITEMS = "CRYPTO_CHECKOUT_ITEMS";

export function useCheckoutItems({ id }: { id: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([CRYPTO_CHECKOUT_ITEMS, id], async () => {
    return (
      await instance?.get<any[]>(`/payments/checkout-session/${id}/items`)
    )?.data;
  });
}

export function useConfirmCheckout() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({
      txHash,
      checkoutId,
      chainId,
      tokenAddress,
    }: {
      txHash: string;
      checkoutId: string;
      chainId: number;
      tokenAddress: string;
    }) => {
      return (
        await instance?.post(
          `/payments/checkout-session/${checkoutId}/confirm`,
          { txHash, chainId, tokenAddress }
        )
      )?.data;
    }
  );
}

export const CHECKOUT_STATUS = "CHECKOUT_STATUS";

export function useCheckoutData({ id }: { id: string }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [CHECKOUT_STATUS, id],
    async () => {
      return (
        await instance?.get<CryptoCheckoutSession>(
          `/payments/checkout-session/${id}`
        )
      )?.data;
    },
    { refetchInterval: 3000 }
  );
}

export const PLAN_COSTS = "PLAN_COSTS";

export function usePlanCosts(slug?: string) {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery([PLAN_COSTS, slug], async () => {
    if (!slug) {
      return [];
    }
    return (
      await instance?.get<
        {
          id: number;
          plan: string;
          feat: string;
          model?: string;
          price: string;
        }[]
      >(`/payments/plans/${slug}/costs`)
    )?.data;
  });
}

export const PLANS_QUERY = "PLANS_QUERY";

export function usePlanPrices() {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery([PLANS_QUERY], async () => {
    return (
      await instance?.get<{ amount: string; name: string; slug: string }[]>(
        `/payments/plans`
      )
    )?.data;
  });
}

export function usePlanCheckoutMutation() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ plan }: { plan: string }) => {
    return (
      await instance?.get<{ url: string }>("/payments/checkout-session", {
        params: { plan },
      })
    )?.data;
  });
}
export const ACTIVE_FEAT_USAGE_QUERY = "ACTIVE_FEAT_USAGE_QUERY";

export function useActiveFeatUsage() {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<FeatUsage>(
    [ACTIVE_FEAT_USAGE_QUERY],
    async () => {
      return (await instance?.get(`/payments/active-usage`))?.data;
    },
    { refetchInterval: 5000 }
  );
}
