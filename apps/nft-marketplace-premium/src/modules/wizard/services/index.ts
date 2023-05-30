import axios from 'axios';
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { Token } from '../../../types/blockchain';

export async function getTokenList(url: string) {
  const response = await axios.get(url);
  return response.data.tokens as Token[];
}

export async function isContract(chainId: number, address: string) {
  return null;
}

export async function getContractImplementation({
  provider,
  contractAddress,
}: {
  contractAddress: string;
  provider: ethers.providers.JsonRpcProvider;
}): Promise<string> {
  const contract = new ethers.Contract(
    contractAddress,
    [
      {
        inputs: [],
        name: 'implementation',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    provider
  );

  return await contract.implementation();
}

export async function isProxyContract({
  provider,
  contractAddress,
}: {
  contractAddress: string;
  provider: ethers.providers.JsonRpcProvider;
}): Promise<boolean> {
  try {
    const addr = await getContractImplementation({ contractAddress, provider });

    return isAddress(addr);
  } catch (err) {
    return false;
  }
}
