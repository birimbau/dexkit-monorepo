

import { Web3ReactHooks } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { MagicLoginType } from "../connectors/magic";

export type BaseActivateParams = {
  connectorName: "magic" | "metamask" | "walletConnect" | "coinbase";
  connector: Connector,
};

export type ActivateMetamaskParams = BaseActivateParams & {
  connectorName: "metamask";
};

export type ActivateCoinbaseParams = BaseActivateParams & {
  connectorName: "coinbase";
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
  | ActivateWalletConnectParams
  | ActivateCoinbaseParams;


export enum ConnectionType {
  UNISWAP_WALLET_V2 = 'UNISWAP_WALLET_V2',
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT_V2 = 'WALLET_CONNECT_V2',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
  DEPRECATED_NETWORK = 'DEPRECATED_NETWORK',
  EIP_6963_INJECTED = 'EIP_6963_INJECTED',
  MAGIC = 'MAGIC'
}

export enum ConnectionLoginType {
  EMAIL = 'EMAIl',
  GOOGLE = 'GOOGLE',
  TWITTER = 'TWITTER',
  DISCORD = 'DISCORD'
}

export interface ProviderInfo {
  name: string
  icon?: string
  rdns?: string
}

export interface Connection {
  connector: Connector
  hooks: Web3ReactHooks
  type: ConnectionType
  loginType?: ConnectionLoginType
  shouldDisplay(): boolean
  /** Executes specific pre-activation steps necessary for some connection types. Returns true if the connection should not be activated. */
  overrideActivate?: (chainId?: number) => boolean
  /** Optionally include isDarkMode when displaying icons that should change with current theme */
  getProviderInfo(isDarkMode?: boolean): ProviderInfo
}