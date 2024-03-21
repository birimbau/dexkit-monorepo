import { CallInput } from '@indexed-finance/multicall';
import axios from 'axios';
import { BigNumber, Contract, providers, utils } from 'ethers';

import { ERC1155Abi, ERC165Abi, ERC721Abi } from '../constants/abis';
import { Asset, AssetAPI, AssetMetadata, Collection, CollectionAPI, OrderBookItem, OrderbookAPI } from '../types/nft';
import { ipfsUriToUrl } from '../utils/ipfs';
import { getMulticallFromProvider } from './multical';

import { AppPageSection } from '@/modules/wizard/types/section';
import { ChainId } from '@dexkit/core/constants';
import { NETWORK_FROM_SLUG } from '@dexkit/core/constants/networks';
import { Value } from '@react-page/editor';
import { QueryClient } from '@tanstack/react-query';
import { DEXKIT_AUTHENTICATE_API_KEY, DEXKIT_BASE_API_URL, TRADER_ORDERBOOK_API } from '../constants';
import { GET_ASSET_BY_API, GET_ASSET_DATA, GET_ASSET_METADATA, GET_COLLECTION_DATA } from '../hooks/nft';
import { getChainIdFromSlug, getNetworkSlugFromChainId } from '../utils/blockchain';
import { getWhereNFTQuery, isENSContract, parseNFTPageEditorConfig, returnNFTmap } from '../utils/nfts';
import { TraderOrderFilter } from '../utils/types';
import { getProviderBySlug } from './providers';


const ENS_BASE_URL = 'https://metadata.ens.domains';
const DEXKIT_NFT_BASE_URL = `${DEXKIT_BASE_API_URL}`;
//const DEXKIT_NFT_BASE_URL = 'https://dexkit-main-api-9vzhs.ondigitalocean.app';
//const DEXKIT_NFT_BASE_URL = 'https://goldfish-app-lh5o5.ondigitalocean.app'
//const DEXKIT_NFT_BASE_URL = 'http://localhost:3000';

//const DEXKIT_NFT_BASE_URL = 'http://localhost:3001'
const metadataENSapi = axios.create({ baseURL: ENS_BASE_URL });

const dexkitNFTapi = axios.create({ baseURL: DEXKIT_NFT_BASE_URL, timeout: 5000 });

const orderbookNFTapi = axios.create({ baseURL: DEXKIT_NFT_BASE_URL, timeout: 10000 });

export async function getAssetDexKitApi({
  networkId,
  contractAddress,
  tokenId,
}: {
  networkId: string;
  contractAddress: string;
  tokenId: string;
}) {

  const resp = await dexkitNFTapi.get<AssetAPI>(`/asset/${networkId}/${contractAddress.toLowerCase()}/${tokenId}`);
  // We replace it with the cdn image
  const imageUrl = resp.data.imageUrl?.replace('dexkit-storage.nyc3.digitaloceanspaces.com', 'dexkit-storage.nyc3.cdn.digitaloceanspaces.com');

  if (imageUrl) {
    return { ...resp.data, imageUrl };
  }
  return resp.data
}

export async function searchAssetsDexKitApi({ keyword, collections }: { keyword: string, collections?: string }) {
  const resp = await dexkitNFTapi.get<AssetAPI[]>(`/asset/search`, { params: { keyword, collections } });
  return resp.data;

}

export async function getMultipleAssetDexKitApi({
  networkId,
  contractAddress,
  tokenIds,
}: {
  networkId: string;
  contractAddress: string;
  tokenIds: string[];
}) {

  const resp = await dexkitNFTapi.get<AssetAPI[]>(`/asset/multiple/${networkId}/${contractAddress.toLowerCase()}/${tokenIds.join(',')}`);
  // We replace it with the cdn image
  const imageUrl = resp.data.map((a) => {
    let imageUrl;
    if (a.imageUrl) {
      imageUrl = a.imageUrl.replace('dexkit-storage.nyc3.digitaloceanspaces.com', 'dexkit-storage.nyc3.cdn.digitaloceanspaces.com');
    }
    if (imageUrl) {
      return { ...a, imageUrl };
    } else {
      return a;
    }
  })

  if (imageUrl) {
    return { ...resp.data, imageUrl };
  }
  return resp.data
}

export async function getCollectionAssetsDexKitApi({
  networkId,
  contractAddress,
  traitsFilter,
  skip,
  take,
}: {
  networkId: string;
  contractAddress: string;
  traitsFilter?: string;
  skip?: number;
  take?: number;
}) {

  const resp = await dexkitNFTapi.get<{ data: AssetAPI[], skip: number, take: number, total: number }>(`/asset/collection/${networkId}/${contractAddress.toLowerCase()}`, { params: { skip, take, traits: traitsFilter } });
  return resp.data;
}


export async function getERC1155Balance({
  provider,
  contractAddress,
  tokenId,
  account,
}: {
  provider?: providers.JsonRpcProvider,
  contractAddress: string;
  tokenId: string;
  account: string;
}) {
  if (!provider || !contractAddress || !tokenId || !account) {
    return;
  }

  const multicall = await getMulticallFromProvider(provider);
  const iface = new utils.Interface(ERC1155Abi);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'balanceOf',
    args: [account, tokenId],
  });
  const response = await multicall?.multiCall(calls);
  if (response) {
    const [, results] = response;
    return results[0] as BigNumber;
  }
}

export async function getERC721TotalSupply({
  provider,
  contractAddress,
}: {
  provider?: providers.JsonRpcProvider,
  contractAddress: string;
}) {
  if (!provider || !contractAddress) {
    return;
  }

  const multicall = await getMulticallFromProvider(provider);
  const iface = new utils.Interface(ERC721Abi);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'totalSupply'
  });
  const response = await multicall?.multiCall(calls);
  if (response) {
    const [, results] = response;
    return results[0] as BigNumber;
  }
}



export async function getAssetByApi({
  chainId,
  contractAddress,
  tokenId,
}: {
  chainId: number;
  contractAddress: string;
  tokenId: string;
}) {
  const resp = await axios.get<Asset>('/api/asset', {
    params: { chainId, contractAddress, tokenId },
  });

  return resp.data;
}

export async function getCollectionByApi({
  chainId,
  contractAddress,
}: {
  chainId: number;
  contractAddress: string;
}) {
  const resp = await axios.get<Collection>('/api/collection', {
    params: { chainId, contractAddress },
  });

  return resp.data;
}

export async function getAssetData(
  provider?: providers.JsonRpcProvider,
  contractAddress?: string,
  id?: string,
  account?: string,
  network?: string
): Promise<Asset | undefined> {
  if (!provider || !contractAddress || !id) {
    return;
  }
  if (isENSContract(contractAddress)) {
    const data = await getENSAssetData(provider, contractAddress, id);
    return data;
  }
  const protocol = await getAssetProtocol(provider, contractAddress);
  const isERC1155 = protocol === 'ERC1155' ? true : false;

  const multicall = await getMulticallFromProvider(provider);
  const iface = new utils.Interface(isERC1155 ? ERC1155Abi : ERC721Abi);
  let calls: CallInput[] = [];
  if (!isERC1155) {
    calls.push({
      interface: iface,
      target: contractAddress,
      function: 'ownerOf',
      args: [id],
    });
  }

  if (isERC1155 && account) {
    calls.push({
      interface: iface,
      target: contractAddress,
      function: 'balanceOf',
      args: [account, id],
    });
  }

  calls.push({
    interface: iface,
    target: contractAddress,
    function: isERC1155 ? 'uri' : 'tokenURI',
    args: [id],
  });

  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'name',
  });

  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'symbol',
  });

  const response = await multicall?.multiCall(calls);

  if (response) {
    const [, results] = response;

    let owner = '0x';
    let tokenURI;
    let name;
    let symbol;
    let balance = null;
    if (isERC1155) {

      if (account) {
        balance = results[0]
        tokenURI = results[1];
        name = results[2];
        symbol = results[3];
      } else {
        tokenURI = results[0];
        name = results[1];
        symbol = results[2];
      }


    } else {
      owner = results[0];
      tokenURI = results[1];
      name = results[2];
      symbol = results[3];
    }

    let chainId;
    if (network) {
      chainId = NETWORK_FROM_SLUG(network)?.chainId;
    }
    if (!chainId) {
      const { chainId: networkChain } = await provider.getNetwork();
      chainId = networkChain;
    }




    return {
      owner,
      tokenURI,
      collectionName: name,
      symbol,
      id,
      contractAddress,
      chainId,
      protocol: isERC1155 ? 'ERC1155' : 'ERC721',
      balance,
    };
  }
}


export async function getENSAssetData(
  provider?: providers.JsonRpcProvider,
  contractAddress?: string,
  id?: string
): Promise<Asset | undefined> {
  if (!provider || !contractAddress || !id) {
    return;
  }

  const response = await metadataENSapi.get(`/mainnet/${contractAddress}/${id}`);
  const data = response.data;
  const iface = new utils.Interface(ERC721Abi);
  const contract = new Contract(contractAddress, iface, provider);
  const owner = await contract.ownerOf(id);

  if (data) {
    const { chainId } = await provider.getNetwork();
    return {
      owner,
      tokenURI: `${ENS_BASE_URL}/mainnet/${contractAddress}/${id}`,
      collectionName: data.name,
      symbol: 'ENS',
      id,
      contractAddress,
      chainId,
    };
  }
}

export async function getApiCollectionData(
  networkId?: string,
  contractAddress?: string

): Promise<Collection | undefined> {
  if (!networkId || !contractAddress) {
    return;
  }

  const response = await dexkitNFTapi.get<Collection>(`/collection/${networkId}/${contractAddress.toLowerCase()}`);
  return response.data
}

export async function getApiAccountContractCollectionData(
  account?: string

): Promise<{ collection: CollectionAPI }[] | undefined> {
  if (!account) {
    return;
  }

  const response = await dexkitNFTapi.get<{ collection: CollectionAPI }[]>(`/contract/collections/account/${account.toLowerCase()}`);
  return response.data
}

export async function getApiContractCollectionData(
  networkId?: string,
  address?: string

): Promise<{ collection: CollectionAPI, metadata: any } | undefined> {
  if (!networkId || !address) {
    return;
  }

  const response = await dexkitNFTapi.get<{ collection: CollectionAPI, metadata: any }>(`/contract/collection/${networkId}/${address.toLowerCase()}`);
  return response.data
}




export async function getSyncCollectionData(
  networkId?: string,
  contractAddress?: string

): Promise<Collection | undefined> {
  if (!networkId || !contractAddress) {
    return;
  }

  const response = await dexkitNFTapi.get<Collection>(`/collection/sync/${networkId}/${contractAddress.toLowerCase()}`, {
    headers: {
      'Dexkit-Api-Key': DEXKIT_AUTHENTICATE_API_KEY

    }
  });
  return response.data
}



export async function getCollectionData(
  provider?: providers.JsonRpcProvider,
  contractAddress?: string
): Promise<Collection | undefined> {
  if (!provider || !contractAddress) {
    return;
  }

  const multicall = await getMulticallFromProvider(provider);
  const iface = new utils.Interface(ERC721Abi);
  let calls: CallInput[] = [];

  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'name',
  });

  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'symbol',
  });

  const response = await multicall?.multiCall(calls);
  if (response) {
    const [, results] = response;

    const name = results[0];
    const symbol = results[1];

    const { chainId } = await provider.getNetwork();

    return {
      name,
      symbol,
      address: contractAddress,
      chainId,
    };
  }
}

export async function getAssetsFromOrderbook(
  provider?: providers.JsonRpcProvider,
  filters?: TraderOrderFilter
) {
  if (provider === undefined) {
    return;
  }

  const orderbook = await getOrderbookOrders(filters);

  const ids = new Set<{
    id: string, address: string, chainId: string
  }>(
    orderbook.orders.map((order) => {
      return {
        id: order.nftTokenId,
        address: order.nftToken,
        chainId: order.chainId,

      }
    })
  );




}


export async function getCollectionAssetsFromOrderbook(
  provider?: providers.JsonRpcProvider,
  filters?: TraderOrderFilter
) {
  if (provider === undefined || filters?.nftToken === undefined) {
    return;
  }

  const orderbook = await getOrderbookOrders(filters);

  const ids = new Set<string>(
    orderbook.orders.map((order) => order.nftTokenId)
  );

  const protocol = await getAssetProtocol(provider, filters.nftToken);

  const isERC1155 = protocol === 'ERC1155';
  let assets: Asset[] = [];
  const tokenIds = Array.from(ids);
  const maxItemsFetch = 25;
  const divider = Math.ceil(tokenIds.length / maxItemsFetch);
  for (let index = 0; index < divider; index++) {
    const max = (index + 1) * maxItemsFetch > tokenIds.length ? tokenIds.length : (index + 1) * maxItemsFetch;
    const idsToPick = tokenIds.slice(index * maxItemsFetch, max)
    const ass = await getAssetsData(
      provider,
      filters.nftToken,
      idsToPick,
      isERC1155
    );
    if (ass) {
      assets = assets.concat(ass);
    }

  }
  return assets;
}

export async function getAssetProtocol(provider?: providers.JsonRpcProvider, contractAddress?: string): Promise<'ERC721' | 'ERC1155' | 'ERC20' | 'UNKNOWN'> {
  if (!provider || !contractAddress) {
    return 'UNKNOWN';
  }


  const multicall = await getMulticallFromProvider(provider);
  const iface = new utils.Interface(ERC165Abi);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'supportsInterface',
    args: ['0xd9b67a26'],
  });
  const response = await multicall?.multiCall(calls);
  if (response) {
    const [, results] = response;
    const isERC1155 = results[0];
    if (isERC1155) {
      return 'ERC1155';
    }
  }
  return 'ERC721'
}

//Return multiple assets at once
export async function getAssetsData(
  provider: providers.JsonRpcProvider,
  contractAddress: string,
  ids: string[],
  isERC1155 = false
): Promise<Asset[] | undefined> {

  if (isENSContract(contractAddress)) {
    const data: Asset[] = [];
    for (const id of ids) {
      const response = await getENSAssetData(provider, contractAddress, id);
      if (response) {
        data.push(response);
      }
    }
    return data;
  }
  const multicall = await getMulticallFromProvider(provider);
  const iface = new utils.Interface(isERC1155 ? ERC1155Abi : ERC721Abi);
  let calls: CallInput[] = [];
  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'name',
  });

  calls.push({
    interface: iface,
    target: contractAddress,
    function: 'symbol',
  });
  for (let index = 0; index < ids.length; index++) {
    calls.push({
      interface: iface,
      target: contractAddress,
      function: isERC1155 ? 'uri' : 'tokenURI',
      args: [ids[index]],
    });
  }


  const response = await multicall?.multiCall(calls);
  const assets: Asset[] = [];
  if (response) {
    const { chainId } = await provider.getNetwork();
    const [, results] = response;
    const name = results[0];
    const symbol = results[1];

    for (let index = 0; index < ids.length; index++) {
      assets.push({
        tokenURI: results[index + 2],
        collectionName: name,
        symbol,
        id: ids[index],
        contractAddress,
        chainId,
        protocol: isERC1155 ? 'ERC1155' : 'ERC721',
      });
    }
    return assets;
  }
  return assets;
}



export async function getAssetMetadata(
  tokenURI: string,
  defaultValue?: AssetMetadata,
  isERC1155?: boolean,
  tokenId?: string,
) {
  let uri = tokenURI;

  if (isERC1155 && tokenId && tokenURI && tokenURI?.search('/0x{id}') !== -1) {
    uri = tokenURI.replace('0x{id}', tokenId);
  }
  if (isERC1155 && tokenId && tokenURI && tokenURI?.search('/{id}') !== -1) {
    uri = tokenURI.replace('{id}', tokenId.length === 64 ? tokenId : Number(tokenId).toString(16).padStart(64, '0').toLowerCase());
  }

  if (tokenURI?.startsWith('data:application/json;base64')) {
    const jsonURI = Buffer.from(tokenURI.substring(29), "base64").toString();
    return JSON.parse(jsonURI);

  }

  try {
    const response = await axios.get<AssetMetadata>(
      ipfsUriToUrl(uri || ''),
      {
        timeout: 5000,
      }
    );
    return response.data;
  } catch (e) {
    return defaultValue;
  }
}

export interface OrderbookResponse {
  orders: OrderBookItem[];
}

export function getOrderbookOrders(orderFilter?: TraderOrderFilter) {
  return axios
    .get<OrderbookResponse>(`${TRADER_ORDERBOOK_API}`, { params: orderFilter })
    .then((resp) => resp.data);
}

export async function getDKAssetOrderbook(orderFilter?: TraderOrderFilter) {
  return await orderbookNFTapi.get<OrderbookAPI>(`/asset/orderbook`, { params: orderFilter });
}

/**
 * Server side function to refetch query client data
 */
export async function fetchAssetForQueryClient({ item, queryClient }: { item: { chainId: ChainId, contractAddress: string, tokenId: string }, queryClient: QueryClient }) {

  const slug = getNetworkSlugFromChainId(item.chainId);

  if (slug === undefined) {
    return;
  }
  let assetApi: AssetAPI | undefined;
  try {
    assetApi = await getAssetDexKitApi({
      networkId: slug,
      contractAddress: item.contractAddress,
      tokenId: item.tokenId,
    });
  } catch (e) {
    console.log(e);
    console.log(`fetchAsset: error fetching token ${item.tokenId}, address: ${item.contractAddress} at ${slug} from api`);
  }

  if (assetApi) {
    const provider = getProviderBySlug(slug);

    await provider?.ready;

    const asset = await getAssetData(
      provider,
      item.contractAddress,
      item.tokenId,
      undefined,
      slug
    );

    const rawMetadata = assetApi.rawData
      ? JSON.parse(assetApi.rawData)
      : undefined;
    let image = assetApi?.imageUrl;

    if (rawMetadata && rawMetadata?.image && (rawMetadata?.image as string).endsWith('.gif')) {
      image = rawMetadata?.image;
    }


    const newAsset: Asset = {
      id: assetApi.tokenId,
      chainId: getChainIdFromSlug(slug)?.chainId as ChainId,
      contractAddress: assetApi.address,
      tokenURI: assetApi.tokenURI || '',
      collectionName: assetApi.collectionName || '',
      symbol: assetApi.symbol || '',
      metadata: { ...rawMetadata, image },
      owner: asset?.owner,
    };

    await queryClient.prefetchQuery(
      [GET_ASSET_DATA, item.contractAddress, item.tokenId],
      async () => newAsset
    );

    await queryClient.prefetchQuery(
      [GET_ASSET_METADATA, newAsset.tokenURI],
      async () => {
        return { ...rawMetadata, image: assetApi?.imageUrl };
      }
    );

  } else {
    const provider = getProviderBySlug(slug);

    await provider?.ready;

    const protocol = await getAssetProtocol(provider, item.contractAddress);

    const isERC1155 = protocol === 'ERC1155';
    const asset = await getAssetData(
      provider,
      item.contractAddress,
      item.tokenId,
      undefined,
      slug
    );

    if (asset) {
      await queryClient.prefetchQuery(
        [GET_ASSET_DATA, item.contractAddress, item.tokenId],
        async () => asset
      );

      const metadata = await getAssetMetadata(asset.tokenURI, {
        image: '',
        name: `${asset.collectionName} #${asset.id}`,
      }, isERC1155, item.tokenId);

      await queryClient.prefetchQuery(
        [GET_ASSET_METADATA, asset.tokenURI, asset.id, asset.protocol],
        async () => {
          return metadata;
        }
      );
    }
  }
}


/**
 * Server side function to refetch query client data
 */
export async function fetchMultipleAssetForQueryClient({ sections, queryClient }: { sections: AppPageSection[], queryClient: QueryClient }) {
  try {


    let assetsToFetch = new Map<number, Map<string, Set<string>>>();

    for (let section of sections) {
      if (
        section.type === 'featured' ||
        section.type === 'call-to-action' ||
        section.type === 'collections'
      ) {
        for (let item of section.items) {
          if (item.type === 'asset' && item.tokenId !== undefined) {
            assetsToFetch = returnNFTmap({
              address: item.contractAddress.toLowerCase(),
              chainId: item.chainId,
              tokenId: item.tokenId,
              currentMap: assetsToFetch,
            });
          }

          if (item.type === 'collection') {
            await queryClient.prefetchQuery(
              [GET_COLLECTION_DATA, item.contractAddress, item.chainId],
              async () => {
                return {
                  name: item.title || ' ',
                  symbol: ' ',
                  address: item.contractAddress,
                  chainId: item.chainId,
                };
              }
            );
          }
        }
      }
      if (section.type === 'asset-section') {
        const data = section.config;
        assetsToFetch = returnNFTmap({
          address: data.address.toLowerCase(),
          chainId: NETWORK_FROM_SLUG(data.network)?.chainId,
          tokenId: data.tokenId,
          currentMap: assetsToFetch,
        });
      }
      if (section.type === 'custom') {
        const config = section.data
          ? (JSON.parse(section.data) as Value)
          : undefined;
        if (config) {
          const editorNfts = parseNFTPageEditorConfig({ config });

          for (const item of editorNfts) {

            assetsToFetch = returnNFTmap({
              address: item.contractAddress.toLowerCase(),
              chainId: NETWORK_FROM_SLUG(item.network)?.chainId,
              tokenId: item.id,
              currentMap: assetsToFetch,
            });

          }
        }
      }
    }

    const query = getWhereNFTQuery({ mapData: assetsToFetch });


    const assets = await getApiMultipleAssets({ query });



    if (assets) {
      for (const assetApi of assets) {
        const rawMetadata = assetApi.rawData
          ? JSON.parse(assetApi.rawData)
          : undefined;
        let image = assetApi?.imageUrl;

        if (rawMetadata && rawMetadata?.image && (rawMetadata?.image as string).endsWith('.gif')) {
          image = rawMetadata?.image;
        }
        const chainId = getChainIdFromSlug(assetApi.networkId)?.chainId as ChainId;


        const newAsset: Asset = {
          id: assetApi.tokenId,
          chainId: chainId,
          contractAddress: assetApi.address,
          tokenURI: assetApi.tokenURI || '',
          collectionName: assetApi.collectionName || '',
          symbol: assetApi.symbol || '',
          metadata: { ...rawMetadata, image },
        };

        await queryClient.prefetchQuery(
          [GET_ASSET_DATA, assetApi.address, assetApi.tokenId],
          async () => newAsset
        );

        await queryClient.prefetchQuery(
          [GET_ASSET_BY_API, chainId, assetApi.address, assetApi.tokenId],
          async () => newAsset
        );

        await queryClient.prefetchQuery(
          [GET_ASSET_METADATA, newAsset.tokenURI],
          async () => {
            return { ...rawMetadata, image: assetApi?.imageUrl };
          }
        );
      }
    }
  } catch (e) {
    console.error('error fetching multiple assets', e)
  }



}



export async function getApiMultipleAssets({ query }: { query: any }

): Promise<AssetAPI[] | undefined> {
  if (!query) {
    return;
  }

  const response = await dexkitNFTapi.post<AssetAPI[]>(`/asset/multiple-assets`, query);
  return response.data
}

