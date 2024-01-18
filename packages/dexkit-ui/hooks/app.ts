import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useMemo } from "react";

import { ChainId } from "@dexkit/core";
import { DexkitApiProvider } from "@dexkit/core/providers";
import { Network } from "@dexkit/core/types";
import { ethers } from "ethers";
import { SiteContext } from "../providers/SiteProvider";
import { NetworkMetadata } from "../types/api";

export function useSiteIdV2() {
  return useContext(SiteContext);
}

export const NETWORK_DATA_QUERY = "NETWORK_DATA_QUERY";

export function useNetworkData({ chainId }: { chainId?: number }) {
  const { instance } = useContext(DexkitApiProvider);

  return useQuery([NETWORK_DATA_QUERY, chainId]);
}

export function useNetworkMetadata() {
  const queryClient = useQueryClient();

  const { siteId } = useSiteIdV2();

  const NETWORKS: { [key: number]: Network } = useMemo(() => {
    if (!siteId) {
      return {};
    }

    const result: NetworkMetadata[] | undefined = queryClient.getQueryData([
      "PREFETCH_ACTIVE_NETWORKS",
      siteId,
    ]);

    if (result) {
      return result.reduce(
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
      );
    }

    return {};
  }, [queryClient, siteId]);

  const NETWORK_SLUG = (chainId?: ChainId) =>
    chainId && NETWORKS[chainId] ? NETWORKS[chainId].slug : undefined;

  const NETWORK_FROM_SLUG = (slug?: string) => {
    if (slug) {
      const network = Object.values(NETWORKS).find(
        (n) => n.slug?.toLowerCase() === slug.toLowerCase()
      );
      if (network) {
        return network;
      }
    }
  };

  const getNetworkMetadata = (chainId?: ChainId) => {
    return queryClient.getQueryData<NetworkMetadata>([
      NETWORK_DATA_QUERY,
      chainId,
    ]);
  };

  const getChainSlug = (chainId?: number) => {
    if (chainId) {
      return NETWORKS[chainId]?.slug;
    }
  };

  const NETWORK_NAME = (chainId?: ChainId) => getNetworkMetadata(chainId)?.name;

  const NETWORK_IMAGE = (chainId?: ChainId) =>
    getNetworkMetadata(chainId)?.imageUrl;

  const NETWORK_SYMBOL = (chainId?: ChainId) =>
    getNetworkMetadata(chainId)?.nativeSymbol;

  const getNetworks = ({ includeTestnet }: { includeTestnet: boolean }) => {
    if (includeTestnet) {
      return Object.values(NETWORKS);
    } else {
      return Object.values(NETWORKS).filter((n) => !n.testnet);
    }
  };

  const getChainIdFromSlug = (chainName?: string) => {
    if (!chainName) {
      return;
    }

    const keys = Object.keys(NETWORKS).map(Number);

    let key = keys.find((key) => NETWORKS[key].slug === chainName);

    if (key !== undefined) {
      return NETWORKS[key];
    }

    return undefined;
  };

  const getNetworkFromSlug = (chainName?: string) => {
    if (!chainName) {
      return;
    }

    const keys = Object.keys(NETWORKS).map(Number);

    let key = keys.find((key) => NETWORKS[key].slug === chainName);

    if (key !== undefined) {
      return NETWORKS[key];
    }

    return undefined;
  };

  const getNetworkFromName = (chainName: string) => {
    const keys = Object.keys(NETWORKS).map(Number);

    let key = keys.find(
      (key) => NETWORKS[key].name.toLowerCase() === chainName?.toLowerCase()
    );

    if (key !== undefined) {
      return NETWORKS[key];
    }

    return undefined;
  };

  const getNetworkSlugFromChainId = (chainId?: ChainId) => {
    if (chainId) {
      return NETWORKS[chainId].slug;
    }
  };

  const getProviderByChainId = (chainId?: ChainId) => {
    if (chainId) {
      if (NETWORKS[chainId].providerRpcUrl) {
        return new ethers.providers.JsonRpcProvider(
          NETWORKS[chainId].providerRpcUrl
        );
      }
    }
  };

  const NETWORK_EXPLORER = (chainId?: ChainId) => {
    if (chainId) {
      if (NETWORKS[chainId].explorerUrl) {
        return NETWORKS[chainId].explorerUrl;
      }
    }
  };

  return {
    NETWORK_IMAGE,
    NETWORK_NAME,
    NETWORK_SYMBOL,
    NETWORK_EXPLORER,
    NETWORK_SLUG,
    NETWORK_FROM_SLUG,
    getChainIdFromSlug,
    getNetworkSlugFromChainId,
    getProviderByChainId,
    getNetworkFromName,
    getNetworkFromSlug,
    getNetworks,
    getChainSlug,
    NETWORKS: NETWORKS,
  };
}
