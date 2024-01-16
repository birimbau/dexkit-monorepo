import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { ChainId } from "@dexkit/core";
import {
  NETWORK_EXPLORER,
  NETWORK_FROM_SLUG,
  NETWORK_SLUG,
} from "@dexkit/core/constants/networks";
import { DexkitApiProvider } from "@dexkit/core/providers";
import { SiteContext } from "../providers/SiteProvider";
import { NetworkMetadata } from "../types/api";

export function useSiteIdV2() {
  return useContext(SiteContext);
}

export const NETWORK_DATA_QUERY = "NETWORK_DATA_QUERY";

export function useNetworkData({ chainId }: { chainId?: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery(
    [NETWORK_DATA_QUERY, chainId],
    async () => {
      if (!instance || !chainId) {
        return null;
      }

      return (
        await instance.get<NetworkMetadata>("/networks/metadata/${chainId}")
      ).data;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
}

export function useNetworkMetadata() {
  const queryClient = useQueryClient();

  const getNetworkMetadata = (chainId?: ChainId) => {
    return queryClient.getQueryData<NetworkMetadata>([
      NETWORK_DATA_QUERY,
      chainId,
    ]);
  };

  const NETWORK_NAME = (chainId?: ChainId) => getNetworkMetadata(chainId)?.name;

  const NETWORK_IMAGE = (chainId?: ChainId) =>
    getNetworkMetadata(chainId)?.imageUrl;

  const NETWORK_SYMBOL = (chainId?: ChainId) =>
    getNetworkMetadata(chainId)?.nativeSymbol;

  return {
    NETWORK_IMAGE,
    NETWORK_NAME,
    NETWORK_SYMBOL,
    NETWORK_EXPLORER,
    NETWORK_SLUG,
    NETWORK_FROM_SLUG,
  };
}
