export interface ChainData {
  name: string;
  chain: string;
  icon: {
    publicURL: string;
  };
  rpc: string[];
  chainId: number;
  nativeCurrency: ChainCurrency;
  explorers?: BlockExplorer[];
}

export interface ChainCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface BlockExplorer {
  name: string;
  url: string;
  standard: string;
}