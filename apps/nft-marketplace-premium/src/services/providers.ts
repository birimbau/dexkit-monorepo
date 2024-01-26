import { getChainFromSlug } from '@dexkit/ui/utils/networks';
import { QueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';

export function getProviderBySlug(
  queryClient: QueryClient,
  siteId?: number,
  slug?: string
) {
  const network = getChainFromSlug(queryClient, siteId, slug || '');

  if (
    network !== undefined &&
    network?.rpcs &&
    network?.rpcs.length > 0 &&
    network?.rpcs[0].url
  ) {
    return new ethers.providers.JsonRpcProvider(network?.rpcs[0].url);
  }
}
