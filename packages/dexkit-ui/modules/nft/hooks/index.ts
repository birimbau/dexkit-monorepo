import { ChainId } from "@dexkit/core/constants";
import { NETWORK_SLUG } from "@dexkit/core/constants/networks";
import { useNetworkProvider } from "@dexkit/core/hooks/blockchain";
import { Asset, AssetMetadata, SwapApiOrder } from "@dexkit/core/types/nft";
import { isAddressEqual } from "@dexkit/core/utils";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  NftSwapV4,
  SwappableAssetV4,
  SwappableNftV4,
} from "@traderxyz/nft-swap-sdk";
import { PostOrderResponsePayload } from "@traderxyz/nft-swap-sdk/dist/sdk/v4/orderbook";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { BigNumber } from "ethers";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { getAssetDexKitApi } from "../../../constants/api";
import { useAppConfig, useDexKitContext } from "../../../hooks";
import { useNetworkMetadata } from "../../../hooks/app";
import { useTokenList } from "../../../hooks/blockchain";
import { accountAssetsAtom } from "../../../state";
import { NFTType } from "../constants/enum";
import {
  getAssetByApi,
  getAssetData,
  getAssetMetadata,
  getAssetsData,
  getCollectionByApi,
  getDKAssetOrderbook,
  getOrderbookOrders,
  searchAssetsDexKitApi,
} from "../services";
import { AssetAPI, OrderBookItem, TraderOrderFilter } from "../types";
import { calculeFees, parseAssetApi } from "../utils";

export const GET_NFT_ORDERS = "GET_NFT_ORDERS";

export const GET_COLLECTION_BY_API = "GET_COLLECTION_BY_API";

export function useCollectionByApi({
  chainId,
  contractAddress,
}: {
  chainId?: number;
  contractAddress?: string;
}) {
  return useQuery(
    [GET_COLLECTION_BY_API, chainId, contractAddress],
    async () => {
      if (chainId === undefined || contractAddress === undefined) {
        return;
      }

      return await getCollectionByApi({ chainId, contractAddress });
    }
  );
}

export const GET_ASSETS_ORDERBOOK = "GET_ASSETS_ORDERBOOK";

export const useAssetsOrderBook = (orderFilter?: TraderOrderFilter) => {
  return useQuery([GET_ASSETS_ORDERBOOK, orderFilter], async () => {
    return (await getDKAssetOrderbook(orderFilter)).data;
  });
};

export const GET_ASSET_BY_API = "GET_ASSET_BY_API";

export function useAssetByApi({
  chainId,
  contractAddress,
  tokenId,
}: {
  chainId?: number;
  contractAddress?: string;
  tokenId?: string;
}) {
  return useQuery(
    [GET_ASSET_BY_API, chainId, contractAddress, tokenId],
    async () => {
      if (
        chainId === undefined ||
        contractAddress === undefined ||
        tokenId === undefined
      ) {
        return;
      }

      return await getAssetByApi({ chainId, contractAddress, tokenId });
    }
  );
}

export const GET_ASSET_METADATA = "GET_ASSET_METADATA";

export function useAssetMetadata(
  asset?: Asset,
  options?: Omit<UseQueryOptions, any>
) {
  return useQuery<AssetMetadata | undefined>(
    [GET_ASSET_METADATA, asset?.tokenURI, asset?.protocol, asset?.id],
    async () => {
      if (asset?.tokenURI === undefined) {
        return;
      }
      // Note: we are returning all metadata from dexkit api, so we check if asset has metadata before fetching it from the api
      if (asset?.metadata) {
        return asset.metadata;
      }

      return await getAssetMetadata(
        asset?.tokenURI,
        {
          image: "",
          name: `${asset.collectionName} #${asset.id}`,
        },
        asset?.protocol === "ERC1155",
        asset?.id
      );
    },
    { ...options, enabled: asset?.tokenURI !== undefined }
  );
}

export function useSwapSdkV4(provider: any, chainId?: number) {
  return useMemo(() => {
    if (chainId === undefined || provider === undefined) {
      return undefined;
    }

    return new NftSwapV4(provider, provider.getSigner(), chainId);
  }, [provider, chainId]);
}

export function useApproveAssetMutation(
  nftSwapSdk?: NftSwapV4,
  address?: string,
  onSuccess?: (hash: string, asset: SwappableAssetV4) => void,
  options?: Omit<UseMutationOptions, any>
) {
  const mutation = useMutation(
    async ({ asset }: { asset: SwappableAssetV4 }) => {
      if (address === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      const tx = await nftSwapSdk.approveTokenOrNftByAsset(asset, address);

      if (onSuccess) {
        onSuccess!(tx.hash, asset);
      }

      const receipt = await tx.wait();

      return receipt.status === 1 && receipt.confirmations >= 1;
    },
    options
  );

  return mutation;
}

export function useMakeOfferMutation(
  nftSwapSdk?: NftSwapV4,
  address?: string,
  chainId?: number,
  options?: UseMutationOptions<PostOrderResponsePayload | undefined, any, any>
) {
  const appConfig = useAppConfig();
  const tokens = useTokenList({ chainId });

  const mutation = useMutation<PostOrderResponsePayload | undefined, any, any>(
    async ({
      assetOffer,
      another,
      expiry,
    }: {
      assetOffer: SwappableNftV4;
      another: SwappableAssetV4;
      expiry?: number | Date | undefined;
    }) => {
      if (address === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      if (another.type !== "ERC20") {
        return;
      }

      let options: any = {
        expiry,
      };

      const token = tokens.find((t) =>
        isAddressEqual(t.address, another.tokenAddress)
      );

      if (appConfig.fees && token) {
        options.fees = calculeFees(
          BigNumber.from(another.amount),
          token.decimals,
          appConfig.fees
        );
      }

      const order = nftSwapSdk.buildOrder(
        another,
        //@ts-ignore
        assetOffer,
        address,
        options
      );

      const signedOrder = await nftSwapSdk.signOrder(order);

      const newOrder = await nftSwapSdk.postOrder(
        signedOrder,
        nftSwapSdk.chainId.toString()
      );

      return newOrder;
    },
    options
  );

  return mutation;
}

export function useMakeListingMutation(
  nftSwapSdk?: NftSwapV4,
  address?: string,
  chainId?: number,
  options?: UseMutationOptions<PostOrderResponsePayload | undefined, any, any>
) {
  const tokens = useTokenList({ includeNative: true, chainId });
  const appConfig = useAppConfig();

  const mutation = useMutation<PostOrderResponsePayload | undefined, any, any>(
    async ({ assetOffer, another, expiry, taker }: any) => {
      if (address === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      let options: any = {
        expiry,
        taker,
      };

      const token = tokens.find((t) =>
        isAddressEqual(t.address, another.tokenAddress)
      );

      if (appConfig.fees && token) {
        options.fees = calculeFees(
          BigNumber.from(another.amount),
          token.decimals,
          appConfig.fees
        );
      }

      const order = nftSwapSdk.buildOrder(
        assetOffer,
        another,
        address,
        options
      );

      const signedOrder = await nftSwapSdk.signOrder(order);

      const newOrder = await nftSwapSdk.postOrder(
        signedOrder,
        nftSwapSdk.chainId.toString()
      );

      return newOrder;
    },
    options
  );

  return mutation;
}

export function useFavoriteAssets() {
  const { assets, setAssets } = useDexKitContext();

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
    [assets]
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

const GET_ACCOUNTS_ASSETS = "GET_ACCOUNTS_ASSETS";

export function useAccountAssetsBalance(
  accounts: string[],
  useSuspense = true
) {
  const [accountAssets, setAccountAssets] = useAtom(accountAssetsAtom);
  const { NETWORKS } = useNetworkMetadata();

  const accountAssetsQuery = useQuery(
    [GET_ACCOUNTS_ASSETS, accounts],
    async () => {
      if (!accounts) {
        return false;
      }
      if (!accounts.length) {
        return false;
      }
      const atualDate = new Date().getTime();
      const query = JSON.stringify(accounts);
      if (
        accountAssets?.lastTimeFetched &&
        accountAssets?.lastTimeFetched.time < atualDate + 86400000 &&
        accountAssets?.lastTimeFetched.query === query
      ) {
        return false;
      }
      const networks = Object.values(NETWORKS)
        .filter((n) => !n.testnet)
        .map((n) => n.slug)
        .join(",");
      const accFlat = accounts.join(",");
      const response = await axios.get<
        {
          total?: number;
          page?: number;
          account?: string;
          network?: string;
          perPage?: number;
          assets?: AssetAPI[];
        }[]
      >(`/api/wallet/nft`, {
        params: { accounts: accFlat, networks: networks },
      });
      if (response.data && response.data.length) {
        setAccountAssets({
          data: response.data.map((a) => {
            return {
              ...a,
              assets: a.assets?.map(parseAssetApi) as unknown as Asset[],
            };
          }),
          lastTimeFetched: {
            time: new Date().getTime(),
            query: JSON.stringify(accounts),
          },
        });
        return true;
      }
      return true;
    },
    { suspense: useSuspense }
  );
  return { accountAssets, accountAssetsQuery };
}

export const GET_ASSET_DATA = "GET_ASSET_DATA";

export function useAsset(
  contractAddress?: string,
  tokenId?: string,
  options?: Omit<UseQueryOptions<Asset>, any>,
  lazy?: boolean,
  networkChainId?: ChainId
) {
  const queryClient = useQueryClient();
  const networkProvider = useNetworkProvider(networkChainId);

  const { NETWORK_SLUG } = useNetworkMetadata();

  const {
    provider: injectedProvider,
    chainId: injectedChainId,
    isActive,
    account,
  } = useWeb3React();

  const assetCached = queryClient.getQueryState<Asset | undefined>([
    GET_ASSET_DATA,
    contractAddress,
    tokenId,
  ]);

  const provider = networkProvider || injectedProvider;
  const chainId = networkChainId || injectedChainId;

  const hasChainDiff =
    provider !== undefined &&
    typeof window !== "undefined" &&
    assetCached?.data?.chainId !== chainId;

  return useQuery(
    [GET_ASSET_DATA, contractAddress, tokenId],
    async () => {
      if (
        chainId === undefined ||
        provider === undefined ||
        contractAddress === undefined ||
        tokenId === undefined
      ) {
        return;
      }
      const asset = await getAssetData(
        provider,
        contractAddress,
        tokenId,
        account
      );

      let assetApi: AssetAPI | undefined;
      try {
        assetApi = await getAssetDexKitApi({
          networkId: NETWORK_SLUG(chainId) || "",
          contractAddress: contractAddress,
          tokenId: tokenId,
        });
      } catch {
        console.log(
          `error fetching token ${tokenId}, address: ${contractAddress} at ${NETWORK_SLUG(
            chainId
          )} from api`
        );
      }
      if (assetApi) {
        const rawMetadata = assetApi.rawData
          ? JSON.parse(assetApi.rawData)
          : undefined;
        const newAsset: Asset = {
          id: assetApi.tokenId,
          chainId: chainId as ChainId,
          contractAddress: assetApi.address,
          tokenURI: assetApi.tokenURI || "",
          collectionName: assetApi.collectionName || "",
          symbol: assetApi.symbol || "",
          metadata: { ...rawMetadata, image: assetApi?.imageUrl },
          owner: asset?.owner,
          protocol: asset?.protocol,
          balance: asset?.balance,
        };
        return newAsset;
      }
      return asset;
    },
    {
      ...options,
      refetchOnMount: false,
      refetchOnWindowFocus: !hasChainDiff && isActive == true,
      enabled:
        !hasChainDiff ||
        (Boolean(lazy) &&
          contractAddress !== undefined &&
          tokenId !== undefined),
    }
  );
}

export function useCancelSignedOrderMutation(
  nftSwapSdk?: NftSwapV4,
  orderType?: "ERC721" | "ERC1155", // TODO: types
  onHash?: (hash: string, order: SwapApiOrder) => void,
  options?: Omit<UseMutationOptions, any>
) {
  return useMutation<any, any, any>(
    async ({ order }: { order: SwapApiOrder }) => {
      if (orderType === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      const tx = await nftSwapSdk.cancelOrder(order.nonce, orderType);

      if (onHash) {
        onHash!(tx.hash, order);
      }

      return await tx.wait();
    },
    options
  );
}
/**
 * mutation to fill nft signed orderr
 * @param nftSwapSdk
 * @param address
 * @param options
 * @returns
 */
export function useFillSignedOrderMutation(
  nftSwapSdk?: NftSwapV4,
  address?: string,
  options?: Omit<UseMutationOptions, any>
) {
  return useMutation(
    async ({
      order,
      accept = false,
    }: {
      accept?: boolean;
      order: SwapApiOrder;
    }) => {
      if (address === undefined || nftSwapSdk === undefined) {
        return undefined;
      }

      const result = await nftSwapSdk.fillSignedOrder(order, {});

      return { hash: result?.hash, accept, order };
    },
    options
  );
}

const SEARCH_ASSETS = "SEARCH_ASSETS";

export type CollectionUniformItem = {
  name: string;
  contractAddress: string;
  backgroundImage: string;
  network: string;
  chainId: number;
  image: string;
};

/**
 * Search assets within search word and filtered by collection
 * @param search
 * @param collections
 * @returns
 */
export function useSearchAssets(
  search?: string,
  collections?: CollectionUniformItem[]
) {
  return useQuery([SEARCH_ASSETS, search], () => {
    if (!search) {
      return [];
    }
    let collectionsFilter = undefined;
    if (collections) {
      collectionsFilter = collections
        .map(
          (c) => `${NETWORK_SLUG(c.chainId)}:${c.contractAddress.toLowerCase()}`
        )
        .join(",");
    }

    return searchAssetsDexKitApi({
      keyword: search,
      collections: collectionsFilter,
    });
  });
}

export const GET_ASSET_LIST_FROM_ORDERBOOK = "GET_ASSET_LIST_FROM_ORDERBOOK";
/**
 * Returns nfts associated with orders
 * @param orderFilter
 * @returns
 */
export const useAssetListFromOrderbook = (orderFilter: TraderOrderFilter) => {
  const ordebookQuery = useOrderBook(orderFilter);
  const provider = useNetworkProvider(orderFilter.chainId);
  return useQuery(
    [GET_ASSET_LIST_FROM_ORDERBOOK, ordebookQuery.data],
    async () => {
      if (ordebookQuery.data === undefined || provider === undefined) {
        return [];
      }
      // We are mapping Collections ---> nft token id's ---> orders
      const orderItemsMap = new Map<string, Map<string, OrderBookItem>>();
      const orders = ordebookQuery.data.orders;
      for (const order of orders) {
        const orderKey = `${order.nftToken}`;
        if (orderItemsMap.has(orderKey)) {
          const collectionMap = orderItemsMap.get(orderKey) as Map<
            string,
            OrderBookItem
          >;
          if (collectionMap.has(order.nftTokenId)) {
            const or = collectionMap.get(order.nftTokenId) as OrderBookItem;
            or.orders?.push(or.order);
            collectionMap.set(order.nftTokenId, or);
            orderItemsMap.set(orderKey, collectionMap);
          } else {
            collectionMap.set(order.nftTokenId, {
              ...order,
              orders: [order.order],
            });
            orderItemsMap.set(orderKey, collectionMap);
          }
        } else {
          const initNFTmap = new Map<string, OrderBookItem>();
          initNFTmap.set(order.nftTokenId, {
            ...order,
            orders: [order.order],
          });
          orderItemsMap.set(orderKey, initNFTmap);
        }
      }
      let assets: Asset[] = [];
      const collections = Array.from(orderItemsMap.keys());

      for (const collection of collections) {
        const itensCollectionMap = orderItemsMap.get(collection) as Map<
          string,
          OrderBookItem
        >;
        const itensCollection = Array.from(itensCollectionMap.values());
        const nftType = itensCollection[0].nftType;
        const nfts = await getAssetsData(
          provider,
          collection,
          itensCollection.map((or) => or.nftTokenId),
          nftType === NFTType.ERC1155
        );
        if (nfts) {
          assets = assets.concat(nfts);
        }
      }
      return assets;
    },
    { enabled: provider !== undefined, suspense: true }
  );
};

/**
 * Return nft orderbook
 * @param orderFilter
 * @returns
 */
export const useOrderBook = (orderFilter: TraderOrderFilter) => {
  return useQuery(
    [GET_NFT_ORDERS, orderFilter],
    async () => {
      if (orderFilter.chainId === undefined) {
        return;
      }

      return await getOrderbookOrders(orderFilter);
    },
    { enabled: orderFilter.chainId !== undefined, suspense: true }
  );
};

export const GET_ASSET_METADATA_FROM_LIST = "GET_ASSET_METADATA_FROM_LIST";
/**
 * Returns assets metadata from orderbook list
 * @param orderFilter
 * @returns
 */
export const useAssetMetadataFromList = (orderFilter: TraderOrderFilter) => {
  const assetListQuery = useAssetListFromOrderbook(orderFilter);
  return useQuery(
    [GET_ASSET_METADATA_FROM_LIST, assetListQuery.data],
    async () => {
      if (!assetListQuery.data) {
        return;
      }
      const data = assetListQuery.data;
      const assetMetadata: Asset[] = [];

      for (let index = 0; index < data.length; index++) {
        const asset = data[index];
        const metadata = await getAssetMetadata(
          asset.tokenURI,
          undefined,
          asset.protocol === "ERC1155",
          asset.id
        );
        assetMetadata.push({
          ...asset,
          metadata: metadata,
        });
      }
      return assetMetadata;
    },
    { suspense: true }
  );
};
