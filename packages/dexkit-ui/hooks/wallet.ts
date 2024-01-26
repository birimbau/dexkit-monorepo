import { ChainId } from "@dexkit/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNetworkMetadata } from "./app";

export const ENS_NAME_QUERY = "ENS_NAME_QUERY";

export function useEnsNameQuery({ address }: { address?: string }) {
  const { NETWORK_PROVIDER } = useNetworkMetadata();

  return useQuery([ENS_NAME_QUERY, address], async () => {
    if (!address) {
      return;
    }
    if (address.split(".").length < 2) {
      return;
    }

    const provider = NETWORK_PROVIDER(ChainId.Ethereum);
    if (!provider) {
      return;
    }

    return await provider.resolveName(address);
  });
}

export function useEnsNameMutation() {
  const { NETWORK_PROVIDER } = useNetworkMetadata();

  return useMutation(async (address: string) => {
    if (!address) {
      return;
    }
    if (address.split(".").length < 2) {
      return;
    }

    const provider = NETWORK_PROVIDER(ChainId.Ethereum);
    if (!provider) {
      return;
    }

    return await provider.resolveName(address);
  });
}
