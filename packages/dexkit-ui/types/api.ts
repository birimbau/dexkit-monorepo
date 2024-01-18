type RPCUrl = {
  id: number;
  createdAt: string;
  updatedAt: string;
  url: string;
  networkId: number;
  disabled: boolean;
  default: boolean;
};

export type NetworkMetadata = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  imageUrl: string | null;
  chainId: number;
  nativeSymbol: string;
  decimals: number;
  testnet: boolean;
  order: any | null;
  explorerUrl?: string;
  slug?: string;
  rpcs?: RPCUrl[];
};
