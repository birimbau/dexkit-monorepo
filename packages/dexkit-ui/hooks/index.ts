import {
  ChainId,
  CONNECTORS,
  TransactionStatus,
  TransactionType,
} from "@dexkit/core/constants";
import { AppTransaction, Asset, TokenWhitelabelApp, TransactionMetadata } from "@dexkit/core/types";
import { switchNetwork } from "@dexkit/core/utils";
import { useMutation } from "@tanstack/react-query";
import { useWeb3React, Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { atom, PrimitiveAtom, useAtom, useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useCallback, useContext, useMemo, useState } from "react";

import { AppConfigContext, AppWizardConfigContext } from "../context/AppConfigContext";
import { DexKitContext, DexkitContextState } from "../context/DexKitContext";
import { localeUserAtom } from "../state";
import {
  AppNotification,
  AppNotificationType,
  CreateAppNotificationParams,
} from "../types";

export * from './blockchain';

// App config context needs to be initialized on widgets
export function useAppConfig() {
  return useContext(AppConfigContext).appConfig;
}

export function useLocale() {
  const [locUser, setLocUser] = useAtom(localeUserAtom);
  const appConfig = useAppConfig();
  const locale = useMemo(() => {
    if (locUser) {
      return locUser;
    }
    if (appConfig.locale) {
      return appConfig.locale;
    }
    return ('en-US' as string);
  }, [appConfig.locale, locUser]);
  return { locale, onChangeLocale: setLocUser };
}


// Wizard App config context needs to be initialized on widgets that needs wizard to customize
export function useAppWizardConfig() {
  const { wizardConfig, setWizardConfig } = useContext(AppWizardConfigContext);
  return { wizardConfig, setWizardConfig };
}

export function useOrderedConnectors({
  selectedWalletAtom,
}: {
  selectedWalletAtom: PrimitiveAtom<string>;
}) {
  const selectedWallet = useAtomValue(selectedWalletAtom);

  return useMemo(() => {
    let connectors: [Connector, Web3ReactHooks][] = [];

    if (selectedWallet) {
      const otherConnectors = Object.keys(CONNECTORS)
        .filter((key) => selectedWallet !== key)
        .map((key) => CONNECTORS[key]);

      connectors = [CONNECTORS[selectedWallet], ...otherConnectors];
    } else {
      const otherConnectors = Object.keys(CONNECTORS).map(
        (key) => CONNECTORS[key]
      );

      connectors = otherConnectors;
    }

    return connectors;
  }, [selectedWallet]);
}

export function useDexkitContextState({
  notificationTypes,
  notificationsAtom,
  tokensAtom,
  assetsAtom,
  transactionsAtom,
  onChangeLocale,
  currencyUserAtom,

}: {
  notificationTypes: { [key: string]: AppNotificationType };
  notificationsAtom: PrimitiveAtom<AppNotification[]>;
  tokensAtom: PrimitiveAtom<TokenWhitelabelApp[]>;
  assetsAtom: PrimitiveAtom<{ [key: string]: Asset }>;
  currencyUserAtom: PrimitiveAtom<string>;
  transactionsAtom: PrimitiveAtom<{ [key: string]: AppTransaction }>;
  onChangeLocale: (locale: string) => void;
}): DexkitContextState {
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const tokens = useAtomValue(tokensAtom);
  const [assets, setAssets] = useAtom(assetsAtom);
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
    assets,
    currencyUser,
    setAssets,
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

export function useDexKitContext() {
  return useContext(DexKitContext);
}

export function useNotifications() {
  const { chainId } = useWeb3React();
  const { notifications, transactions } = useDexKitContext();

  const uncheckedTransactions = useMemo(() => {
    return notifications.filter((n) => !n.checked);
  }, [notifications, chainId]);

  const pendingTransactions = useMemo(() => {
    let objs = Object.keys(transactions)
      .map((key) => {
        return { key, tx: transactions[key] };
      })
      .filter((t) => t.tx.status === TransactionStatus.Pending);

    return objs.reduce((prev: { [key: string]: AppTransaction }, curr) => {
      prev[curr.key] = curr.tx;

      return prev;
    }, {});
  }, [transactions]);

  const hasPendingTransactions = useMemo(() => {
    return Object.keys(pendingTransactions).length > 0;
  }, [pendingTransactions]);

  const filteredUncheckedTransactions = useMemo(() => {
    return uncheckedTransactions.filter((tx) => {
      if (tx.metadata) {
        const txChainId = tx.metadata["chainId"];

        return txChainId === chainId;
      }

      return false;
    });
  }, [chainId, uncheckedTransactions]);

  return {
    uncheckedTransactions,
    hasPendingTransactions,
    filteredUncheckedTransactions,
  };
}

export function useSwitchNetworkMutation() {
  const { connector } = useWeb3React();

  return useMutation<unknown, Error, { chainId: number }>(
    async ({ chainId }) => {
      if (connector) {
        return switchNetwork(connector, chainId);
      }
    }
  );
}

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
  }, []);

  const close = useCallback(() => {
    setDialogIsOpen(false);
    setType(undefined);
    setValues(undefined);
    setMetadata(undefined);
    setError(undefined);
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

const signMessageDialogOpenAtom = atom(false);
const signMessageDialogErrorAtom = atom<Error | undefined>(undefined);
const signMessageDialogSuccessAtom = atom<boolean>(false);
const signMessageDialogMessage = atom<string | undefined>(undefined);

export function useSignMessageDialog() {
  const [open, setOpen] = useAtom(signMessageDialogOpenAtom);
  const [error, setError] = useAtom(signMessageDialogErrorAtom);
  const [isSuccess, setIsSuccess] = useAtom(signMessageDialogSuccessAtom);
  const [message, setMessage] = useAtom(signMessageDialogMessage);

  return {
    isSuccess,
    setIsSuccess,
    error,
    setError,
    open,
    setOpen,
    message,
    setMessage,
  };
}
const isConnectWalletOpenAtom = atom(false);

export function useConnectWalletDialog() {
  const [isOpen, setOpen] = useAtom(isConnectWalletOpenAtom);

  return {
    isOpen,
    setOpen,
  };
}


export const switchNetworkOpenAtom = atom(false);
export const switchNetworkChainIdAtom = atom<number | undefined>(undefined);


export function useSwitchNetwork() {
  const [isOpenSwitchNetwork, setOpenSwitchNetwork] = useAtom(switchNetworkOpenAtom);
  const [networkChainId, setNetworkChainId] = useAtom(switchNetworkChainIdAtom);

  return {
    isOpenSwitchNetwork,
    setOpenSwitchNetwork,
    networkChainId,
    setNetworkChainId
  };
}