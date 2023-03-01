import { ChainId, MagicLoginType, TransactionStatus } from "../constants";

export type BaseActivateParams = {
  connectorName: "magic" | "metamask";
};

export type ActivateMetamaskParams = BaseActivateParams & {
  connectorName: "metamask";
};

export type ActivateMagicParams = BaseActivateParams & {
  connectorName: "magic";
  loginType?: MagicLoginType;
  email?: string;
};

export type WalletActivateParams = ActivateMetamaskParams | ActivateMagicParams;

export interface Transaction {
  title?: string;
  status: TransactionStatus;
  created: number;
  chainId: ChainId;
  checkedBlockNumber?: number;
}
