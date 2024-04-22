import { IntlProvider, MessageFormatElement } from "react-intl";

import { SnackbarProvider } from "notistack";
import { ThirdwebProvider } from "thirdweb/react";
import { useDexkitContextState } from "../hooks";

import { AppTransaction, Asset, TokenWhitelabelApp } from "@dexkit/core/types";

import { CssBaseline } from "@mui/material";
import { PrimitiveAtom, SetStateAction, WritableAtom } from "jotai";

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from "@mui/material/styles";
import React from "react";
import { DexKitContext } from "../context/DexKitContext";
import { AppNotification, AppNotificationType } from "../types";
import TransactionUpdater from "./TransactionUpdater";
export interface DexkitProviderProps {
  theme: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };
  affiliateReferral?: string;
  locale: string;
  activeChainIds?: number[];
  defaultLocale?: string;
  onChangeLocale: (locale: string) => void;
  notificationTypes: { [key: string]: AppNotificationType };
  localeMessages?:
    | Record<string, string>
    | Record<string, MessageFormatElement[]>;
  children: React.ReactNode | React.ReactNode[];
  options?: {
    magicRedirectUrl: string;
  };
  userEventsURL?: string;
  siteId?: number;
  transactionsAtom: WritableAtom<
    {
      [key: string]: AppTransaction;
    },
    SetStateAction<{
      [key: string]: AppTransaction;
    }>,
    void
  >;
  notificationsAtom: PrimitiveAtom<AppNotification[]>;
  tokensAtom: PrimitiveAtom<TokenWhitelabelApp[]>;
  assetsAtom: PrimitiveAtom<{ [key: string]: Asset }>;
  hiddenAssetsAtom: PrimitiveAtom<{ [key: string]: boolean }>;
  currencyUserAtom: PrimitiveAtom<string>;
  selectedWalletAtom: PrimitiveAtom<string>;
}

export function DexkitProvider({
  children,
  theme,
  affiliateReferral,
  currencyUserAtom,
  selectedWalletAtom,
  transactionsAtom,
  locale,
  tokensAtom,
  assetsAtom,
  hiddenAssetsAtom,
  onChangeLocale,
  localeMessages,
  notificationTypes,
  notificationsAtom,
  userEventsURL,
  activeChainIds,
  siteId,
}: DexkitProviderProps) {
  const appState = useDexkitContextState({
    notificationTypes,
    notificationsAtom,
    tokensAtom,
    assetsAtom,
    hiddenAssetsAtom,
    transactionsAtom,
    currencyUserAtom,
    onChangeLocale,
  });

  return (
    <DexKitContext.Provider
      value={{
        ...appState,
        userEventURL: userEventsURL,
        siteId: siteId,
        affiliateReferral,
        activeChainIds: activeChainIds ? activeChainIds : [1],
      }}
    >
      <ThirdwebProvider>
        <IntlProvider
          locale={locale}
          defaultLocale={locale}
          messages={localeMessages}
        >
          <CssVarsProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <CssBaseline />
              {children}
              <TransactionUpdater pendingTransactionsAtom={transactionsAtom} />
            </SnackbarProvider>
          </CssVarsProvider>
        </IntlProvider>
      </ThirdwebProvider>
    </DexKitContext.Provider>
  );
}
