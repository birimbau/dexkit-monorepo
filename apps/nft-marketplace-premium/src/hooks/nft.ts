import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import {
  NftSwapV4,
  SwappableAssetV4
} from '@traderxyz/nft-swap-sdk';
import { useCallback, useMemo } from 'react';

import { BigNumber, Contract, providers } from 'ethers';
import { WETHAbi } from '../constants/abis';

import { useWeb3React } from '@web3-react/core';
import { THIRDWEB_CLIENT_ID, WRAPPED_ETHER_CONTRACT } from '../constants';
import {
  getApiAccountContractCollectionData,
  getApiCollectionData,
  getApiContractCollectionData,
  getCollectionAssetsFromOrderbook,
  getDKAssetOrderbook,
  getERC1155Balance,
  searchAssetsDexKitApi
} from '../services/nft';

import { NFTType } from '../constants/enum';
import {
  Asset,
  AssetBalance,
  HiddenAsset
} from '../types/nft';

import { ChainId } from '@dexkit/core/constants';
import { omitNull } from '@dexkit/core/utils';
import {
  getNetworkSlugFromChainId,
  isAddressEqual
} from '@dexkit/core/utils/blockchain';
import { getCollectionData } from '@dexkit/ui/modules/nft/services';
import { hexToString } from '@dexkit/ui/utils';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { useAtom, useAtomValue } from 'jotai';
import { CollectionUniformItem } from '../modules/wizard/components/pageEditor/components/CollectionAutocompleteUniform';
import { getERC20Balance } from '../services/balances';
import {
  accountAssetsAtom,
  assetsAtom,
  hiddenAssetsAtom,
} from '../state/atoms';
import { AssetRari } from '../types/rarible';

import { TraderOrderFilter } from '../utils/types';
import { useAppConfig } from './app';

export const GET_ASSET_DATA = 'GET_ASSET_DATA';



export const GET_ASSET_BALANCE = 'GET_ASSET_BALANCE';

export function useAssetBalance(asset?: Asset, account?: string) {
  const { provider, chainId } = useWeb3React();
  return useQuery([GET_ASSET_BALANCE, asset, account, chainId], async () => {
    if (
      chainId === undefined ||
      provider === undefined ||
      asset === undefined ||
      account === undefined
    ) {
      return;
    }
    let balance: BigNumber | undefined;

    if (asset?.protocol === 'ERC1155') {
      balance = await getERC1155Balance({
        provider,
        account,
        contractAddress: asset.contractAddress,
        tokenId: asset.id,
      });
    }

    return {
      asset,
      balance,
    } as AssetBalance;
  });
}



export const GET_ASSET_BY_API = 'GET_ASSET_BY_API';




export const GET_COLLECTION_DATA = 'GET_COLLECTION_DATA';

export function useCollection(
  contractAddress?: string,
  chainId?: ChainId,
  lazy?: boolean,
) {
  const { provider, chainId: chainProvider } = useWeb3React();
  const appConfig = useAppConfig();

  return useQuery(
    [GET_COLLECTION_DATA, contractAddress, chainId],
    async () => {
      if (!chainId || contractAddress === undefined) {
        return;
      }

      const sdk = new ThirdwebSDK(chainId, { clientId: THIRDWEB_CLIENT_ID });

      const twContract = await sdk.getContract(contractAddress as string);

      const isTw = twContract.abi.find((m) => m.name === 'contractVersion');


      let collectionFromConfig: any = {};
      let collectionObj: any = {};

      collectionFromConfig = appConfig.collections?.find(
        (c) =>
          isAddressEqual(c.contractAddress, contractAddress) &&
          c.chainId === chainId,
      );

      if (isTw) {
        let contract = await sdk.getContract(contractAddress);
        let metadata = await contract.metadata.get();

        const contractType: string = hexToString(
          await twContract.call('contractType'),
        );

        let type = contractType?.toLowerCase()?.startsWith('edition')
          ? NFTType.ERC1155
          : NFTType.ERC721;

        collectionObj = {
          address: contractAddress,
          chainId,
          name: metadata.name,
          symbol: metadata.symbol,
          description: metadata.description,
          imageUrl: metadata.image,
          nftType: type?.toLowerCase()?.startsWith('edition')
            ? NFTType.ERC1155
            : NFTType.ERC721,
        };
      }

      const collection = await getApiCollectionData(
        getNetworkSlugFromChainId(chainId),
        contractAddress,
      );

      if (collection) {
        return {
          ...omitNull(collectionObj),
          ...omitNull(collection),
          ...omitNull(collectionFromConfig),
        };
      }

      if (
        chainId === undefined ||
        provider === undefined ||
        contractAddress === undefined ||
        chainProvider === undefined
      ) {
        return;
      }

      const onChainCollection = await getCollectionData(
        provider,
        contractAddress,
      );

      return {
        ...omitNull(collectionObj),
        ...omitNull(onChainCollection),
        ...omitNull(collectionFromConfig),
      };
    },
    {
      enabled:
        (provider !== undefined && chainId === chainProvider) || Boolean(lazy),
      refetchOnMount: Boolean(lazy),
      refetchOnWindowFocus: Boolean(lazy),
    },
  );
}

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

export const GET_ASSET_METADATA = 'GET_ASSET_METADATA';


export function useSwapSdkV4(provider: any, chainId?: number) {
  return useMemo(() => {
    if (chainId === undefined || provider === undefined) {
      return undefined;
    }

    return new NftSwapV4(provider, provider.getSigner(), chainId);
  }, [provider, chainId]);
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
export const GET_NFT_ORDERS = 'GET_NFT_ORDERS';



export const GET_ASSETS_ORDERBOOK = 'GET_ASSETS_ORDERBOOK';

export const useAssetsOrderBook = (orderFilter?: TraderOrderFilter) => {
  return useQuery([GET_ASSETS_ORDERBOOK, orderFilter], async () => {
    return (await getDKAssetOrderbook(orderFilter)).data;
  });
};




export function useFavoriteAssets() {
  const [assets, setAssets] = useAtom(assetsAtom);

  const add = (asset: Asset) => {
    setAssets((value) => ({
      ...value,
      [`${asset.chainId}-${asset.contractAddress?.toLowerCase()}-${asset.id}`]:
        asset,
    }));
  };

  const remove = (asset: Asset) => {
    setAssets((value) => {
      let tempValue = { ...value };

      delete tempValue[
        `${asset.chainId}-${asset.contractAddress?.toLowerCase()}-${asset.id}`
      ];

      return tempValue;
    });
  };
  const isFavorite = useCallback(
    (asset?: Asset) => {
      return (
        asset !== undefined &&
        assets !== undefined &&
        assets[
        `${asset.chainId}-${asset.contractAddress.toLowerCase()}-${asset.id}`
        ] !== undefined
      );
    },
    [assets],
  );
  const toggleFavorite = (asset?: Asset) => {
    if (asset !== undefined) {
      if (isFavorite(asset)) {
        remove(asset);
      } else {
        add(asset);
      }
    }
  };
  return { add, remove, assets, isFavorite, toggleFavorite };
}

export function useHiddenAssets() {
  const [assets, setAssets] = useAtom(hiddenAssetsAtom);

  const add = (asset: HiddenAsset) => {
    setAssets((value) => ({
      ...value,
      [`${asset.chainId}-${asset.contractAddress?.toLowerCase()}-${asset.id}`]:
        true,
    }));
  };

  const remove = (asset: HiddenAsset) => {
    setAssets((value) => {
      let tempValue = { ...value };

      tempValue[
        `${asset.chainId}-${asset.contractAddress?.toLowerCase()}-${asset.id}`
      ] = false;

      return tempValue;
    });
  };
  const isHidden = useCallback(
    (asset?: Asset) => {
      return (
        asset !== undefined &&
        assets !== undefined &&
        assets[
        `${asset.chainId}-${asset.contractAddress.toLowerCase()}-${asset.id}`
        ] === true
      );
    },
    [assets],
  );
  const toggleHidden = (asset?: Asset) => {
    if (asset !== undefined) {
      if (isHidden(asset)) {
        remove(asset);
      } else {
        add(asset);
      }
    }
  };

  return { add, remove, assets, isHidden, toggleHidden };
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

export const COLLECTION_ASSETS_FROM_ORDERBOOK =
  'COLLECTION_ASSETS_FROM_ORDERBOOK';

export function useCollectionAssetsFromOrderbook(
  filters: TraderOrderFilter,
  networkChainId?: ChainId,
) {
  const { provider, chainId: injectedChainId } = useWeb3React();
  const chainId = networkChainId || injectedChainId;

  const isProviderEnabled =
    provider !== undefined &&
    chainId !== undefined &&
    chainId === filters.chainId;

  return useQuery(
    [COLLECTION_ASSETS_FROM_ORDERBOOK, filters],
    () => {
      if (provider === undefined) {
        return;
      }

      return getCollectionAssetsFromOrderbook(provider, filters);
    },
    { enabled: isProviderEnabled },
  );
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

export const BEST_SELL_ORDER_RARIBLE = 'BEST_SELL_ORDER_RARIBLE';

export function useBestSellOrderAssetRari(
  network?: string,
  address?: string,
  id?: string,
) {
  return useQuery<AssetRari | undefined>(
    [BEST_SELL_ORDER_RARIBLE, network, address, id],
    () => {
      return undefined;
    },
    { enabled: false },
  );
}
