import { useDexKitContext } from '@dexkit/ui';
import { useWeb3React } from '@web3-react/core';
import { atom, useAtom, useAtomValue } from 'jotai';

import { useUpdateAtom } from 'jotai/utils';
import { useCallback, useContext, useMemo } from 'react';
import { AppConfigContext } from '../contexts';
import {
  localeAtom,
  localeUserAtom,
  transactionDialogErrorAtom,
  transactionDialogHashAtom,
  transactionDialogMetadataAtom,
  transactionDialogOpenAtom,
  transactionDialogRedirectUrlAtom,
  transactionsAtom,
  transactionTypeAtom,
  transactionValuesAtom,
} from '../state/atoms';
import {
  TransactionMetadata,
  TransactionStatus,
  TransactionType,
} from '../types/blockchain';

export function useTransactionDialog() {
  const updateTransactions = useUpdateAtom(transactionsAtom);

  const [isOpen, setDialogIsOpen] = useAtom(transactionDialogOpenAtom);
  const [hash, setHash] = useAtom(transactionDialogHashAtom);
  const [error, setError] = useAtom(transactionDialogErrorAtom);
  const [metadata, setMetadata] = useAtom(transactionDialogMetadataAtom);
  const [type, setType] = useAtom(transactionTypeAtom);

  const [values, setValues] = useAtom(transactionValuesAtom);

  const [redirectUrl, setRedirectUrl] = useAtom(
    transactionDialogRedirectUrlAtom
  );

  const { chainId } = useWeb3React();

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
  }, []);

  const showDialog = useCallback(
    (open: boolean, metadata?: TransactionMetadata, type?: TransactionType) => {
      setDialogIsOpen(open);
      setMetadata(metadata);

      if (!open) {
        setHash(undefined);
        setMetadata(undefined);
        setType(undefined);
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

  const addTransaction = useCallback(
    (hash: string, type: TransactionType, metadata?: TransactionMetadata) => {
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
          },
        }));
      }
    },
    [chainId]
  );

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

// App config context is passed on _app.tsx, in each page we need to pass
// app config in static props to context be initialized
export function useAppConfig() {
  return useContext(AppConfigContext).appConfig;
}

export function useAppNFT() {
  return useContext(AppConfigContext).appNFT;
}

export function useCollections() {
  const appConfig = useAppConfig();
  return appConfig?.collections;
}

export function useLocale() {
  const loc = useAtomValue(localeAtom);
  const { onChangeLocale } = useDexKitContext();
  const locUser = useAtomValue(localeUserAtom);
  const appConfig = useAppConfig();
  const locale = useMemo(() => {
    if (locUser) {
      return locUser;
    }
    if (appConfig.locale && appConfig.locale !== loc) {
      return appConfig.locale;
    }
    return loc || ('en-US' as string);
  }, [appConfig.locale, locUser, loc]);
  return { locale, onChangeLocale };
}
