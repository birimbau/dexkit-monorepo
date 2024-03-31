import { NFTType } from '@dexkit/ui/modules/nft/constants/enum';
import { AssetAPI } from '@dexkit/ui/modules/nft/types';
import { DkApiPlatformCoin } from '@dexkit/widgets/src/types/api';
import { BigNumber } from 'ethers';
import { SellOrBuy } from '../constants/enum';
import { Token } from './blockchain';

export interface SwapApiOrder {
  direction: number;
  erc20Token: string;
  erc20TokenAmount: string;
  erc721Token: string;
  erc721TokenId: string;
  erc721TokenProperties: any[];
  expiry: string;
  fees: any[];
  maker: string;
  nonce: string;
  signature: {
    r: string;
    s: string;
    signatureType: number;
    v: number;
  };
  taker: string;
}

export interface OrderBookItem {
  erc20Token: string;
  erc20TokenAmount: string;
  nftToken: string;
  nftTokenId: string;
  nftTokenAmount: string;
  nftType: NFTType;
  sellOrBuyNft: SellOrBuy;
  chainId: string;
  order: SwapApiOrder;
  orders?: SwapApiOrder[];
  asset?: Asset;
  token?: Token;
}

export interface Asset {
  id: string;
  chainId: number;
  contractAddress: string;
  owner?: string;
  tokenURI: string;
  collectionName: string;
  symbol: string;
  type?: string;
  metadata?: AssetMetadata;
  balance?: BigNumber;
  protocol?: 'ERC1155' | 'ERC721';
}

export interface AssetMetadata {
  name: string;
  image?: string;
  description?: string;
  animation_url?: string;
  attributes?: {
    display_type?: string;
    trait_type: string;
    value: string;
  }[];
}


export type OrderbookAPI = {
  data: {
    asset?: AssetAPI,
    order?: OrderBookItem,
    token?: DkApiPlatformCoin
  }[]
  total: number,
  take: number,
  skip: number;
}

export type AssetStoreOptions = {
  name?: string;
  title?: string;
  profileImageURL?: string;
  backgroundImageURL?: string;
  description?: string;
  storeAccount?: string;
}