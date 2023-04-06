import { useDexKitContext } from '@dexkit/ui';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useContext, useMemo } from 'react';
import { AppConfigContext } from '../contexts';
import {
  localeAtom,
  localeUserAtom
} from '../state/atoms';






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

export function useSiteId() {
  return useContext(AppConfigContext).siteId;
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
