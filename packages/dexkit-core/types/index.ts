import { ChainId, MagicLoginType, TransactionStatus } from "../constants";

export type Token = {
  chainId: ChainId;
  contractAddress: string;
  name: string;
  symbol: string;
  coingeckoId?: string;
  decimals: number;
  /**
   * @deprecated
   */
  isWrapped?: boolean;
  logoURI?: string;
};

export type TokenPrices = {
  [key: number]: { [key: string]: { [key: string]: number } };
};

export type Network = {
  chainId: ChainId;
  name: string;
  symbol: string;
  coinName?: string;
  coinSymbol?: string;
  coinImageUrl?: string;
  coingeckoPlatformId?: string;
  imageUrl?: string;
  testnet?: boolean;
  explorerUrl?: string;
  wrappedAddress?: string;
  slug?: string;
  providerRpcUrl?: string;
};

export type BaseActivateParams = {
  connectorName: "magic" | "metamask" | "walletConnect";
};

export type ActivateMetamaskParams = BaseActivateParams & {
  connectorName: "metamask";
};

export type ActivateWalletConnectParams = BaseActivateParams & {
  connectorName: "walletConnect";
};

export type ActivateMagicParams = BaseActivateParams & {
  connectorName: "magic";
  loginType?: MagicLoginType;
  email?: string;
};

export type WalletActivateParams =
  | ActivateMetamaskParams
  | ActivateMagicParams
  | ActivateWalletConnectParams;

export interface Transaction {
  title?: string;
  status: TransactionStatus;
  created: number;
  chainId: ChainId;
  checkedBlockNumber?: number;
}
