import axios from 'axios';
import { ethers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { getBalanceOf, getBalanceOfERC1155, getERC20Balance } from 'src/services/balances';
import { getNetworkSlugFromChainId, getProviderByChainId } from 'src/utils/blockchain';
import { Token } from '../../../types/blockchain';
import { GatedCondition } from '../types';

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

export async function checkGatedConditions({ account, conditions }: { account?: string, conditions: GatedCondition[] }) {
  const balances: { [key: number]: string } = {};
  const partialResults: { [key: number]: boolean } = {};

  if (!account) {
    return { result: false, balances, partialResults };
  }
  if (account && conditions.length === 0) {
    return { result: true, balances, partialResults };
  }
  if (account && conditions) {
    let result;
    for (let index = 0; index < conditions.length; index++) {
      const condition = conditions[index];
      let thisCondition = false;
      // We check all conditions here now
      if (condition.type === 'coin') {
        const balance = await getERC20Balance(condition.address, account, getProviderByChainId(condition.chainId));
        balances[index] = ethers.utils.formatUnits(balance, condition.decimals);
        partialResults[index] = false;
        if (balance.gt(ethers.utils.parseUnits(condition.amount, condition.decimals))) {
          thisCondition = true
          partialResults[index] = true;
        }
      }
      if (condition.type === 'collection' && condition.protocol !== 'ERC1155') {
        const balance = await getBalanceOf(getNetworkSlugFromChainId(condition.chainId) as string, condition.address as string, account)
        console.log(balance.toString());
        console.log(ethers.utils.parseUnits(condition.amount, 0).toString());
        balances[index] = ethers.utils.formatUnits(balance, 0);
        partialResults[index] = false;
        if (balance.gte(ethers.utils.parseUnits(condition.amount, 0))) {
          thisCondition = true;
          partialResults[index] = true;
        }
      }
      if (condition.type === 'collection' && condition.protocol === 'ERC1155' && condition.tokenId) {
        const balance = await getBalanceOfERC1155(getNetworkSlugFromChainId(condition.chainId) as string, condition.address as string, account, condition.tokenId as string)
        balances[index] = ethers.utils.formatUnits(balance, 0);
        partialResults[index] = false;
        if (balance.gte(ethers.utils.parseUnits(condition.amount, 0))) {
          thisCondition = true;
          partialResults[index] = true;
        }
      }
      if (!condition.condition) {
        result = thisCondition;
      }
      if (condition.condition === 'or') {
        result = result || thisCondition;
      }
      if (condition.condition === 'and') {
        result = result && thisCondition;
      }
    }
    return { result, balances, partialResults }
  }
}

export function getGatedConditionsText({ conditions }: { conditions: GatedCondition[] }) {
  let text = 'You  to unlock this content you need to meet the follow gated conditions: '
  if (conditions) {
    for (const condition of conditions) {
      if (!condition.condition) {

      }
      if (condition.condition === 'or') {
        text = `${text} or`
      }
      if (condition.condition === 'and') {
        text = `${text} and`
      }

      // We check all conditions here now
      if (condition.type === 'coin') {
        text = `${text} have ${condition.amount} of coin ${condition.symbol?.toUpperCase()} with address ${condition.address} on network ${getNetworkSlugFromChainId(condition.chainId)?.toUpperCase()}`
      }
      if (condition.type === 'collection' && condition.protocol !== 'ERC1155') {
        text = `${text} have ${condition.amount} of collection ${condition.symbol?.toUpperCase()} with address ${condition.address} on network ${getNetworkSlugFromChainId(condition.chainId)?.toUpperCase()}`
      }
      if (condition.type === 'collection' && condition.protocol === 'ERC1155' && condition.tokenId) {
        text = `${text} have ${condition.amount} of collection ${condition.symbol?.toUpperCase()} with id ${condition.tokenId} with address ${condition.address} on network ${getNetworkSlugFromChainId(condition.chainId)?.toUpperCase()} `
      }

    }
    return text
  }
  return ''
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
