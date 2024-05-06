import {
  TransactionStatus
} from "@dexkit/core/constants";
import {
  AppTransaction
} from "@dexkit/core/types";
import { switchNetwork } from "@dexkit/wallet-connectors/utils";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useWeb3React } from "@web3-react/core";
import { atom, useAtom } from "jotai";
import { useCallback, useContext, useMemo } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";

import {
  showTxDialogAtom,
  txDialogLoading,
  txDialogOptions,
  txDialogTransactionsAtom,
} from "../atoms";
import { ThemeMode } from "../constants/enum";
import {
  AppConfigContext,
  AppWizardConfigContext,
} from "../context/AppConfigContext";
import { DexKitContext } from "../context/DexKitContext";
import { userThemeModeAtom } from "../state";
import {
  TxDialogOptions,
  TxDialogTransaction
} from "../types";

import { isHexString } from '@dexkit/core/utils/ethers/isHexString';
import type { providers } from "ethers";
import { AdminContext } from "../context/AdminContext";
import { useAppConfig } from "./useAppConfig";
import { useDexkitContextState, useWatchTransactionDialog } from "./useDexKitContextState";

import { useOrderedConnectors } from "./useOrderedConnectors";

export * from "./auth";
export * from "./blockchain";
export * from "./currency";


export { useAppConfig, useDexkitContextState, useOrderedConnectors, useWatchTransactionDialog };



export function useAppNFT() {
  return useContext(AppConfigContext).appNFT;
}

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function useThemeMode() {
  const systemPrefersDark = useMediaQuery(DARK_SCHEME_QUERY);
  const [userMode, setThemeMode] = useAtom(userThemeModeAtom);
  const appConfig = useAppConfig();

  const mode = useMemo(() => {
    if (userMode) {
      return userMode;
    }
    if (appConfig.defaultThemeMode) {
      return appConfig.defaultThemeMode;
    }
    return systemPrefersDark ? ThemeMode.dark : ThemeMode.light;
  }, [userMode, appConfig, systemPrefersDark]);

  return { mode: mode, setThemeMode, userMode };
}



// Wizard App config context needs to be initialized on widgets that needs wizard to customize
export function useAppWizardConfig() {
  const { wizardConfig, setWizardConfig } = useContext(AppWizardConfigContext);
  return { wizardConfig, setWizardConfig };
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

  const handleConnectWallet = useCallback(() => {
    setOpen(true);
  }, []);

  return {
    isOpen,
    setOpen,
    handleConnectWallet,
  };
}

export const switchNetworkOpenAtom = atom(false);
export const switchNetworkChainIdAtom = atom<number | undefined>(undefined);

export function useSwitchNetwork() {
  const [isOpenSwitchNetwork, setOpenSwitchNetwork] = useAtom(
    switchNetworkOpenAtom
  );
  const [networkChainId, setNetworkChainId] = useAtom(switchNetworkChainIdAtom);

  const openDialog = function (chainId: number | undefined) {
    setOpenSwitchNetwork(true);
    setNetworkChainId(chainId);
  };

  return {
    isOpenSwitchNetwork,
    setOpenSwitchNetwork,
    networkChainId,
    setNetworkChainId,
    openDialog,
  };
}

const showSelectIsOpenAtom = atom(false);

export function useSelectNetworkDialog() {
  const [isOpen, setIsOpen] = useAtom(showSelectIsOpenAtom);

  return { isOpen, setIsOpen };
}

const drawerIsOpenAtom = atom(false);

export function useDrawerIsOpen() {
  const [isOpen, setIsOpen] = useAtom(drawerIsOpenAtom);

  return { isOpen, setIsOpen };
}

const showSelectCurrency = atom(false);

export function useShowSelectCurrency() {
  const [isOpen, setIsOpen] = useAtom(showSelectCurrency);

  return { isOpen, setIsOpen };
}

const showSelectLocaleAtom = atom(false);

export function useShowSelectLocale() {
  const [isOpen, setIsOpen] = useAtom(showSelectLocaleAtom);

  return { isOpen, setIsOpen };
}

const showAppTransactionsAtom = atom(false);

export function useShowAppTransactions() {
  const [isOpen, setIsOpen] = useAtom(showAppTransactionsAtom);

  return { isOpen, setIsOpen };
}

export const holdsKitDialogoAtom = atom(false);

export function useHoldsKitDialog() {
  const [isOpen, setIsOpen] = useAtom(holdsKitDialogoAtom);

  return { isOpen, setIsOpen };
}
export const WAIT_TRANSACTION_QUERY = "WAIT_TRANSACTION_QUERY";

export function useWaitTransactionConfirmation({
  transactionHash,
  provider,
}: {
  transactionHash?: string;
  provider?: providers.Web3Provider;
}) {
  return useQuery(
    [WAIT_TRANSACTION_QUERY, transactionHash],
    async ({ }) => {
      if (!isHexString(transactionHash)) {
        return null;
      }

      if (transactionHash && provider) {
        const receipt = await provider.waitForTransaction(transactionHash);

        return receipt?.confirmations > 0;
      }

      return null;
    },
    {
      enabled: transactionHash !== undefined,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
}

export function useExecuteTransactionsDialog() {
  const [show, setShow] = useAtom(showTxDialogAtom);
  const [transactions, setTransactions] = useAtom(txDialogTransactionsAtom);
  const [isLoading, setIsLoading] = useAtom(txDialogLoading);
  const [options, setOptions] = useAtom(txDialogOptions);

  const handleClose = useCallback(() => {
    setShow(false);
    setTransactions([]);
    setOptions(undefined);
  }, []);

  const execute = useCallback(
    (transactions: TxDialogTransaction[], opts?: TxDialogOptions) => {
      setShow(true);
      setTransactions(transactions);
      setOptions(opts);
    },
    []
  );

  return {
    options,
    isLoading,
    setIsLoading,
    show,
    setShow,
    transactions,
    setTransactions,
    handleClose,
    execute,
  };
}


export function useEditSiteId() {
  const { editSiteId } = useContext(AdminContext);

  return { editSiteId }
}