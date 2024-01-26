import { Network } from "@dexkit/core/types";
import { AxiosInstance } from "axios";
import { NetworkMetadata } from "../types/api";

export async function getActiveNetworks({
  query,
  page,
  limit,
  siteId,
  instance,
}: {
  instance: AxiosInstance;
  query?: string;
  page?: number;
  limit?: number;
  siteId?: number;
}) {
  return (
    await instance.get<NetworkMetadata[]>("/networks/metadata/active", {
      params: { q: query, page, limit, siteId },
    })
  ).data;
}

export async function getActiveNetworksObject({
  siteId,
  instance,
}: {
  instance: AxiosInstance;
  siteId?: number;
}) {
  const result = await getActiveNetworks({
    instance,
    siteId,
    limit: 1000,
    page: 1,
  });

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
            network.rpcs && network.rpcs.length > 0 ? network.rpcs[0].url : "",
          testnet: network.testnet,
        };
        return acc;
      },
      {}
    );
  }

  return {};
}
