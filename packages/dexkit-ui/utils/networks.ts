import { QueryClient } from "@tanstack/react-query";
import { NETWORK_DATA_QUERY } from "../hooks/app";
import { getActiveNetworks } from "../services/app";

import { ChainId } from "@dexkit/core";
import { Network } from "@dexkit/core/types";
import { AxiosInstance } from "axios";
import { NetworkMetadata } from "../types/api";

export async function netToQuery({
  siteId,
  queryClient,
  instance,
}: {
  siteId?: number;
  queryClient: QueryClient;
  instance: AxiosInstance;
}) {
  const activeNetworks = await getActiveNetworks({
    siteId: siteId,
    limit: 1000,
    instance,
    page: 1,
    query: "",
  });

  queryClient.setQueryDefaults(["PREFETCH_ACTIVE_NETWORKS", siteId], {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  queryClient.setQueryData(
    ["PREFETCH_ACTIVE_NETWORKS", siteId],
    activeNetworks
  );

  for (let network of activeNetworks) {
    queryClient.setQueryDefaults([NETWORK_DATA_QUERY, network.chainId], {
      staleTime: Infinity,
      cacheTime: Infinity,
    });

    queryClient.setQueryData([NETWORK_DATA_QUERY, network.chainId], network);
  }

  if (activeNetworks) {
    return {
      NETWORKS: activeNetworks.reduce(
        (acc: { [key: number]: Network }, network: NetworkMetadata) => {
          acc[network.chainId] = {
            chainId: network.chainId,
            symbol: network.nativeSymbol,
            explorerUrl: network.explorerUrl,
            name: network.name,
            slug: network.slug || "",
            imageUrl: network.imageUrl || "",
            providerRpcUrl:
              network.rpcs && network.rpcs.length > 0
                ? network.rpcs[0].url
                : "",
            testnet: network.testnet,
          };
          return acc;
        },
        {}
      ),
    };
  }

  return { NETWORKS: {} as Network };
}

export function getChainIdFromSlugOld(
  queryClient: QueryClient,
  siteId?: number,
  slug?: string
): ChainId | undefined {
  return queryClient
    .getQueryData<NetworkMetadata[]>(["PREFETCH_ACTIVE_NETWORKS", siteId])
    ?.find((n) => n.slug === slug)?.chainId;
}

export function getChainFromSlug(
  queryClient: QueryClient,
  siteId?: number,
  slug?: string
): NetworkMetadata | undefined {
  return queryClient
    .getQueryData<NetworkMetadata[]>(["PREFETCH_ACTIVE_NETWORKS", siteId])
    ?.find((n) => n.slug === slug);
}
