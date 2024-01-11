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
};
