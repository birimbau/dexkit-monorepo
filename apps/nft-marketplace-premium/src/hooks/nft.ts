import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import {
  NftSwapV4,
  SwappableAssetV4
} from '@traderxyz/nft-swap-sdk';
import { useMemo } from 'react';

import { BigNumber, Contract, providers } from 'ethers';
import { WETHAbi } from '../constants/abis';

import { WRAPPED_ETHER_CONTRACT } from '../constants';
import {
  getApiAccountContractCollectionData,
  getApiContractCollectionData,
  searchAssetsDexKitApi
} from '../services/nft';


import {
  getNetworkSlugFromChainId
} from '@dexkit/core/utils/blockchain';
import { useAtomValue } from 'jotai';
import { CollectionUniformItem } from '../modules/wizard/components/pageEditor/components/CollectionAutocompleteUniform';

import {
  accountAssetsAtom
} from '../state/atoms';


import { getERC20Balance } from '@dexkit/core/services/balances';
import { GET_COLLECTION_DATA } from '@dexkit/ui/modules/nft/hooks/collection';



export const GET_ACCOUNT_CONTRACT_COLLECTION_DATA =
  'GET_ACCOUNT_CONTRACT_COLLECTION_DATA';

export function useAccountContractCollection(account?: string) {
  return useQuery([GET_COLLECTION_DATA, account], async () => {
    if (account === undefined) {
      return;
    }
    const contractData = await getApiAccountContractCollectionData(account);
    if (contractData) {
      return contractData;
    }
  });
}

export const GET_CONTRACT_COLLECTION_DATA = 'GET_CONTRACT_COLLECTION_DATA';

export function useContractCollection(networkId?: string, address?: string) {
  return useQuery(
    [GET_CONTRACT_COLLECTION_DATA, address?.toLowerCase(), networkId],
    async () => {
      if (!networkId || address === undefined) {
        return;
      }
      const contractData = await getApiContractCollectionData(
        networkId,
        address,
      );
      if (contractData) {
        return contractData;
      }
    },
  );
}

export const GET_ASSET_APPROVAL = 'GET_ASSET_APPROVAL';

export function useIsAssetApproved(
  nftSwapSdk?: NftSwapV4,
  asset?: SwappableAssetV4,
  address?: string,
) {
  return useQuery(
    [GET_ASSET_APPROVAL, nftSwapSdk, address, asset],
    async () => {
      if (
        address === undefined ||
        nftSwapSdk === undefined ||
        asset === undefined
      ) {
        return undefined;
      }

      return await nftSwapSdk?.loadApprovalStatus(asset, address);
    },
  );
}

export const GET_ERC20_BALANCE = 'GET_ERC20_BALANCE';

export function useErc20Balance(
  provider?: providers.BaseProvider,
  contractAddress?: string,
  account?: string,
) {
  return useQuery<BigNumber | undefined>(
    [GET_ERC20_BALANCE, contractAddress, account],
    async () => {
      if (!contractAddress || !account || !provider) {
        return undefined;
      }

      return getERC20Balance(contractAddress, account, provider);
    },
    {
      enabled: contractAddress !== undefined && account !== undefined,
    },
  );
}

export function useWrapEtherMutation(
  provider?: providers.BaseProvider,
  chainId?: number,
) {
  return useMutation(async ({ amount }: { amount: BigNumber }) => {
    if (chainId === undefined) {
      return;
    }

    const contractAddress = WRAPPED_ETHER_CONTRACT[chainId];

    if (contractAddress === undefined) {
      return;
    }

    const contract = new Contract(contractAddress, WETHAbi, provider);

    return await contract.deposit({ value: amount });
  });
}







export function useTotalAssetsBalance(accounts: string[], networks: string[]) {
  const accountAssets = useAtomValue(accountAssetsAtom);

  const totalAccountAssets = useMemo(() => {
    if (accounts && accountAssets && accountAssets.data) {
      return accountAssets.data
        .filter((a) => accounts.includes(a?.account || ''))
        .filter((a) =>
          networks.length ? networks.includes(a.network || '') : true,
        )
        .map((a) => a.assets?.length)
        .reduce((c, p) => (c || 0) + (p || 0));
    }
    return undefined;
  }, [accounts, networks]);

  return { totalAccountAssets };
}



const SEARCH_ASSETS = 'SEARCH_ASSETS';

export function useSearchAssets(
  search?: string,
  collections?: CollectionUniformItem[],
) {
  return useQuery([SEARCH_ASSETS, search], () => {
    if (!search) {
      return [];
    }
    let collectionsFilter = undefined;
    if (collections) {
      collectionsFilter = collections
        .map(
          (c) =>
            `${getNetworkSlugFromChainId(
              c.chainId,
            )}:${c.contractAddress.toLowerCase()}`,
        )
        .join(',');
    }

    return searchAssetsDexKitApi({
      keyword: search,
      collections: collectionsFilter,
    });
  });
}

