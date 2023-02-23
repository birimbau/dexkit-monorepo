import { NETWORK_ID } from "./enum";

export enum MARKETPLACES {
  OPEN_SEA = 'OPEN_SEA',
  RARIBLE = 'RARIBLE',
  LOOKS_RARE = 'LOOKSRARE',
  SUDOSWAP = 'SUDOSWAP'
}


export const MARKETPLACES_INFO = {
  [MARKETPLACES.OPEN_SEA]: {
    logo: '/marketplaces/opensealogo.svg',
    name: 'OpenSea',
    baseAssetUrl: 'https://opensea.io/assets/',
    networkMapping: {
      [NETWORK_ID.Ethereum]: 'ethereum',
      [NETWORK_ID.Polygon]: 'matic',
      [NETWORK_ID.Optimism]: 'optimism',
      [NETWORK_ID.Arbitrum]: 'arbitrum',
      [NETWORK_ID.Avalanche]: 'avalanche',
      [NETWORK_ID.BSC]: 'bsc'
    }
  },
  [MARKETPLACES.RARIBLE]: {
    logo: '/marketplaces/rariblelogo.png',
    name: 'Rarible',
    baseAssetUrl: 'https://rarible.com/token/',
    networkMapping: {
      [NETWORK_ID.Ethereum]: 'ethereum',
      [NETWORK_ID.Polygon]: 'polygon',
    }
  },
  [MARKETPLACES.LOOKS_RARE]: {
    logo: '/marketplaces/looksrare.png',
    name: 'LooksRare',
    baseAssetUrl: 'https://looksrare.org/collections/',
  },
  [MARKETPLACES.SUDOSWAP]: {
    logo: '/marketplaces/sudoswaplogo.png',
    name: 'SudoSwap',
    baseAssetUrl: 'https://sudoswap.xyz/#/item/',
  },
}

export const MAP_NETWORK_TO_RARIBLE = {
  [NETWORK_ID.Ethereum]: 'ETHEREUM',
  [NETWORK_ID.Polygon]: 'POLYGON'
}

export const MAP_COIN_TO_RARIBLE = {
  [NETWORK_ID.Ethereum]: 'ETH',
  [NETWORK_ID.Polygon]: 'MATIC'
} as { [key: string]: string }