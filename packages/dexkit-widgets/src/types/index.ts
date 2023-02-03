import { ChainId } from "../constants/enum";

export type Token = {
  chainId: ChainId;
  contractAddress: string;
  name: string;
  symbol: string;
  coingeckoId?: string;
  decimals: number;

  isWrapped?: boolean;
};
