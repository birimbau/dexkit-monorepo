import { ChainId } from '@dexkit/core';
import { useScanContractAbi } from '@dexkit/web3forms/hooks';
import { AbiFragment } from '@dexkit/web3forms/types';

export default function ContractFormAbiFetcher({
  contractAddress,
  onSuccess,
  chainId,
  enabled,
}: {
  contractAddress: string;
  onSuccess: (abi: AbiFragment[]) => void;
  chainId: ChainId;
  enabled: boolean;
}) {
  useScanContractAbi({
    contractAddress,
    onSuccess,
    chainId,
    enabled,
  });

  return null;
}
