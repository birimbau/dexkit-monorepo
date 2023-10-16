

import { MagicLoginType } from "../connectors/magic";


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


