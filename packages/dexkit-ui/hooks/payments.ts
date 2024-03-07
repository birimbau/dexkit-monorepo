import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Subscription } from "../types/ai";
import { CreditGrant, CryptoCheckoutSession } from "../types/payments";

export const SUBSCRIPTION_QUERY = "SUBSCRIPTION_QUERY";

export function useSubscription() {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<Subscription>([SUBSCRIPTION_QUERY], async () => {
    return (await instance?.get("/payments/subscription"))?.data;
  });
}

export function useBuyCreditsCheckout() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({
      amount,
      paymentMethod,
    }: {
      amount: number;
      paymentMethod: string;
    }) => {
      return (
        await instance?.post<{ url: string }>("/payments/buy-credits-session", {
          amount: amount.toString(),
        })
      )?.data;
    }
  );
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

  return useQuery([CHECKOUT_STATUS, id], async () => {
    return (
      await instance?.get<CryptoCheckoutSession>(
        `/payments/checkout-session/${id}`
      )
    )?.data;
  });
}
