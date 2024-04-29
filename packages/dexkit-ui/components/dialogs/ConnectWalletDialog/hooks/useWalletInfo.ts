import { useQuery } from "@tanstack/react-query";
import type { WalletId } from "thirdweb/wallets";
import { getWalletInfo } from "thirdweb/wallets";
import { WalletInfo } from "../types";






/**
 * @internal
 */
export function useWalletInfo(id: WalletId) {
  return useQuery<WalletInfo>({
    queryKey: ["wallet-info", id],
    queryFn: () => {
      return getWalletInfo(id, false);
    },
    retry: false,
  });
}

/**
 * @internal
 */
export function useWalletImage(id: WalletId) {
  return useQuery({
    queryKey: ["wallet-image", id],
    queryFn: () => {
      return getWalletInfo(id, true);
    },
    retry: false,
  });
}