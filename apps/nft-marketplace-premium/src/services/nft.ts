import { CallInput } from '@indexed-finance/multicall';
import axios from 'axios';
import { BigNumber, providers, utils } from 'ethers';

import { ERC165Abi, ERC721Abi } from '../constants/abis';
import { Collection, CollectionAPI, OrderBookItem } from '../types/nft';
import { getMulticallFromProvider } from './multical';

import { AssetAPI } from '@dexkit/ui/modules/nft/types';
import { DEXKIT_BASE_API_URL, TRADER_ORDERBOOK_API } from '../constants';
import { TraderOrderFilter } from '../utils/types';



const DEXKIT_NFT_BASE_URL = `${DEXKIT_BASE_API_URL}`;
//const DEXKIT_NFT_BASE_URL = 'https://dexkit-main-api-9vzhs.ondigitalocean.app';
//const DEXKIT_NFT_BASE_URL = 'https://goldfish-app-lh5o5.ondigitalocean.app'
//const DEXKIT_NFT_BASE_URL = 'http://localhost:3000';

//const DEXKIT_NFT_BASE_URL = 'http://localhost:3001'


const dexkitNFTapi = axios.create({ baseURL: DEXKIT_NFT_BASE_URL, timeout: 5000 });



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


export interface OrderbookResponse {
  orders: OrderBookItem[];
}

export function getOrderbookOrders(orderFilter?: TraderOrderFilter) {
  return axios
    .get<OrderbookResponse>(`${TRADER_ORDERBOOK_API}`, { params: orderFilter })
    .then((resp) => resp.data);
}







