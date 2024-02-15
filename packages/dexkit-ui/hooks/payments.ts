import { DexkitApiProvider } from "@dexkit/core/providers";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Subscription } from "../types/ai";

export const SUBSCRIPTION_QUERY = "SUBSCRIPTION_QUERY";

export function useSubscription() {
  const { instance } = useContext(DexkitApiProvider);
  return useQuery<Subscription>([SUBSCRIPTION_QUERY], async () => {
    return (await instance?.get("/payments/subscription"))?.data;
  });
}
