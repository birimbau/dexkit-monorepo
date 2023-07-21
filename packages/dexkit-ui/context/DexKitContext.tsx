import { ChainId, TransactionType } from "@dexkit/core/constants";
import {
  AppTransaction,
  Asset,
  TokenWhitelabelApp,
  TransactionMetadata,
  WatchTransactionDialogProperties,
} from "@dexkit/core/types";
import React, { SetStateAction } from "react";
import {
  AppNotification,
  AppNotificationType,
  CreateAppNotificationParams,
} from "../types";

export interface DexkitContextState {
  onChangeLocale: (locale: string) => void;
  notificationTypes: { [key: string]: AppNotificationType };
  createNotification: (params: CreateAppNotificationParams) => void;
  clearNotifications: () => void;
  checkAllNotifications: () => void;
  notifications: AppNotification[];
  tokens: TokenWhitelabelApp[];
  currencyUser?: string;
  setAssets: (update: SetStateAction<{ [key: string]: Asset }>) => void;

  assets: { [key: string]: Asset };
  transactions: { [key: string]: AppTransaction };
  watchTransactionDialog: WatchTransactionDialogProperties;
}

export const DexKitContext = React.createContext<DexkitContextState>({
  notificationTypes: {},
  notifications: [],
  transactions: {},
  tokens: [],
  assets: {},
  setAssets() {},
  onChangeLocale: (locale: string) => {},
  createNotification: (params: CreateAppNotificationParams) => {},
  checkAllNotifications: () => {},
  clearNotifications: () => {},
  watchTransactionDialog: {
    values: undefined,
    open: (type: string, values: Record<string, any>) => {},
    close: () => {},
    redirectUrl: "",
    setRedirectUrl: (update?: SetStateAction<string | undefined>) => {},
    error: undefined,
    hash: undefined,
    metadata: undefined,
    type: undefined,
    isOpen: false,
    setHash: (update?: SetStateAction<string | undefined>) => {},
    setType: (update?: SetStateAction<string | undefined>) => {},
    setDialogIsOpen: (update: SetStateAction<boolean>) => {},
    setError: (update?: SetStateAction<Error | undefined>) => {},
    setMetadata: (
      update?: SetStateAction<TransactionMetadata | undefined>
    ) => {},
    showDialog: (
      open: boolean,
      metadata?: TransactionMetadata,
      type?: TransactionType
    ) => {},
    setDialogError: (error?: Error) => {},
    addTransaction: ({
      hash,
      type,
      metadata,
      values,
      chainId,
    }: {
      hash: string;
      type: TransactionType;
      metadata?: TransactionMetadata | undefined;
      values: Record<string, any>;
      chainId: ChainId;
    }) => {},
    watch: (hash: string) => {},
  },
});
