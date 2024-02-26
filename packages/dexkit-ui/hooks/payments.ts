import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Subscription } from "../types/ai";
import { CreditGrant } from "../types/payments";

export const SUBSCRIPTION_QUERY = "SUBSCRIPTION_QUERY";

export function useSubscription() {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<Subscription>([SUBSCRIPTION_QUERY], async () => {
    return (await instance?.get("/payments/subscription"))?.data;
  });
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

export function useCreditHistory() {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([], async () => {
    return (await instance?.get<CreditGrant[]>("/payments/credit-history"))
      ?.data;
  });
}
