import { ethers } from 'ethers';
import { getChainIdFromSlug } from '../utils/blockchain';

export function getProviderBySlug(slug: string) {
  const network = getChainIdFromSlug(slug);

  if (network?.chainId !== undefined && network?.providerRpcUrl) {
    return new ethers.providers.JsonRpcProvider(network.providerRpcUrl);
  }
}
