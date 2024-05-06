import { ChainId, TransactionStatus, TransactionType } from "@dexkit/core/constants/enums";
import type { AppTransaction, Asset, TokenWhitelabelApp, TransactionMetadata } from "@dexkit/core/types";
import { PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useCallback, useState } from "react";
import type { AppNotification, AppNotificationType, CreateAppNotificationParams } from "../types";


export function useWatchTransactionDialog({
  transactionsAtom,
}: {
  transactionsAtom: PrimitiveAtom<{
    [key: string]: AppTransaction;
  }>;
}) {
  const updateTransactions = useUpdateAtom(transactionsAtom);

  const [isOpen, setDialogIsOpen] = useState(false);
  const [hash, setHash] = useState<string>();
  const [error, setError] = useState<Error>();
  const [metadata, setMetadata] = useState<TransactionMetadata>();
  const [type, setType] = useState<string>();

  const [values, setValues] = useState<Record<string, any>>();

  const [redirectUrl, setRedirectUrl] = useState<string>();

  const watch = useCallback((hash: string) => {
    setHash(hash);
  }, []);

  const open = useCallback((type: string, values: Record<string, any>) => {
    setDialogIsOpen(true);
    setValues(values);
    setType(type);
    setHash(undefined);
  }, []);

  const close = useCallback(() => {
    setDialogIsOpen(false);
    setType(undefined);
    setValues(undefined);
    setMetadata(undefined);
    setError(undefined);
    setHash(undefined);
  }, []);

  const showDialog = useCallback(
    (open: boolean, metadata?: TransactionMetadata, type?: TransactionType) => {
      setDialogIsOpen(open);
      setMetadata(metadata);

      if (!open) {
        setHash(undefined);
        setMetadata(undefined);
        setType(undefined);
        setError(undefined);
      }
    },
    []
  );

  const setDialogError = useCallback(
    (error?: Error) => {
      if (isOpen) {
        setError(error);
      }
    },
    [setError, isOpen]
  );

  const addTransaction = ({
    hash,
    type,
    metadata,
    values,
    chainId,
  }: {
    hash: string;
    type: TransactionType;
    metadata?: TransactionMetadata;
    values: Record<string, any>;
    chainId: ChainId;
  }) => {
    if (chainId !== undefined) {
      setHash(hash);

      updateTransactions((txs) => ({
        ...txs,
        [hash]: {
          chainId,
          created: new Date().getTime(),
          status: TransactionStatus.Pending,
          type,
          metadata,
          checked: false,
          values,
        },
      }));
    }
  };

  return {
    values,
    open,
    close,
    redirectUrl,
    setRedirectUrl,
    error,
    hash,
    metadata,
    type,
    setHash,
    isOpen,
    setDialogIsOpen,
    setError,
    setMetadata,
    setType,
    showDialog,
    setDialogError,
    addTransaction,
    watch,
  };
}

export function useDexkitContextState({
  notificationTypes,
  notificationsAtom,
  tokensAtom,
  assetsAtom,
  hiddenAssetsAtom,
  transactionsAtom,
  onChangeLocale,
  currencyUserAtom,
}: {
  notificationTypes: { [key: string]: AppNotificationType };
  notificationsAtom: PrimitiveAtom<AppNotification[]>;
  tokensAtom: PrimitiveAtom<TokenWhitelabelApp[]>;
  assetsAtom: PrimitiveAtom<{ [key: string]: Asset }>;
  hiddenAssetsAtom: PrimitiveAtom<{ [key: string]: boolean }>;
  currencyUserAtom: PrimitiveAtom<string>;
  transactionsAtom: PrimitiveAtom<{ [key: string]: AppTransaction }>;
  onChangeLocale: (locale: string) => void;
}) {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const [tokens, setTokens] = useAtom(tokensAtom);
  const [assets, setAssets] = useAtom(assetsAtom);
  const [hiddenAssets, setHiddenAssets] = useAtom(hiddenAssetsAtom);
  const currencyUser = useAtomValue(currencyUserAtom);
  const [transactions, setTransactions] = useAtom(transactionsAtom);
  const watchTransactionDialog = useWatchTransactionDialog({
    transactionsAtom,
  });

  const checkAllNotifications = () => {
    setNotifications((notifications) => {
      return notifications.map((n) => ({ ...n, checked: true }));
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const createNotification = (params: CreateAppNotificationParams) => {
    setNotifications((notifications) => {
      const date = new Date().getTime();

      const newNotification: AppNotification = {
        date,
        subtype: params.subtype,
        type: params.type,
        icon: params.icon,
        metadata: params.metadata,
        values: params.values,
        url: params.url,
      };

      if (params.metadata && params.metadata["hash"]) {
        const hash = params.metadata["hash"];
        const chainId = params.metadata["chainId"];

        if (chainId) {
          setTransactions((transactions) => {
            return {
              ...transactions,
              [hash]: {
                chainId,
                created: date,
                status: TransactionStatus.Pending,
                values: params.values,
                type: params.subtype,
              },
            };
          });
        }
      }

      return [...notifications, newNotification];
    });
  };

  return {
    tokens,
    setTokens,
    assets,
    currencyUser,
    setAssets,
    hiddenAssets,
    setHiddenAssets,
    transactions,
    createNotification,
    clearNotifications,
    checkAllNotifications,
    onChangeLocale,
    notificationTypes,
    notifications: notifications.reverse(),
    watchTransactionDialog,
  };
}