import { QueryClient } from "@tanstack/react-query";
import { NETWORK_DATA_QUERY } from "../hooks/app";
import { getActiveNetworks } from "../services/app";

import { AxiosInstance } from "axios";

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

  for (let network of activeNetworks) {
    await queryClient.prefetchQuery(
      [NETWORK_DATA_QUERY, network.chainId],
      async () => {
        return network;
      }
    );
  }
}
