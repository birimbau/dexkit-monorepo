import { providers } from 'ethers';
import { getChainIdFromSlug } from '../utils/blockchain';

export function getProviderBySlug(slug: string) {
  const network = getChainIdFromSlug(slug);

  if (network?.chainId !== undefined && network?.providerRpcUrl) {
    return new providers.JsonRpcProvider(network.providerRpcUrl);
  }
}
