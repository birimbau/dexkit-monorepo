export enum SwapSteps {
  Start,
  StartApproval,
  WaitingWalletApproval,
  FinishApproval,
  StartSwap,
  WaitingWalletSwap,
  FinishSwap,
}

export enum TraderOrderStatus {
  Open = 'open',
  Filled = 'filled',
  Expired = 'expired',
  Cancelled = 'cancelled',
  All = 'all',
}

export enum TraderOrderVisibility {
  Public = 'public',
  Private = 'private',
}

export enum NetworkName {
  ETH = 'eth',
  BSC = 'bsc',
  POLYGON = 'polygon',
  AVAX = 'avax',
  FANTOM = 'ftm',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  MUMBAI = 'mumbai',
  OPTMISM = 'optimism',
  Arbitrum = 'arbitrum',
  CELO = 'celo',
}

export const enum NETWORK_ID {
  Ethereum = 'ethereum',
  Goerli = 'goerli',
  Mumbai = 'mumbai',
  Polygon = 'polygon',
  BSC = 'bsc',
  Avalanche = 'avalanche',
  Fantom = 'fantom',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum'
}

export enum ChainId {
  ETH = 1,
  Ropsten = 3,
  BSC = 56,
  Polygon = 137,
  AVAX = 43114,
  FANTOM = 250,
  Rinkeby = 4,
  Goerli = 5,
  Mumbai = 80001,
  Arbitrum = 42161,
  Optimism = 10,
  CELO = 42220,
}

export enum NFTType {
  ERC1155 = 'ERC1155',
  ERC721 = 'ERC721',
}

export enum SellOrBuy {
  All = 'all',
  Sell = 'sell',
  Buy = 'buy',
}

export enum AppWhitelabelType {
  DEX = 'DEX',
  MARKETPLACE = 'MARKETPLACE',
  AGGREGATOR = 'AGGREGATOR',
}

export enum CollectionSyncStatus {
  NotSynced = 'NotSynced',
  Syncing = 'Syncing',
  Synced = 'Synced',
  NotSyncable = 'NotSyncable'
}
