import { IntlProvider, MessageFormatElement } from "react-intl";

import { Web3ReactProvider } from "@web3-react/core";
import { SnackbarProvider } from "notistack";
import { useMemo } from "react";
import { useDexkitContextState, useOrderedConnectors } from "../hooks";

import { AppTransaction, Asset, TokenWhitelabelApp } from "@dexkit/core/types";
import { getConnectorName } from "@dexkit/core/utils";
import { CssBaseline } from "@mui/material";
import { PrimitiveAtom, SetStateAction, WritableAtom } from "jotai";

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  SupportedColorScheme,
} from "@mui/material/styles";
import React from "react";
import { DexKitContext } from "../context/DexKitContext";
import { AppNotification, AppNotificationType } from "../types";
import { MagicStateProvider } from "./MagicStateProvider";
import TransactionUpdater from "./TransactionUpdater";
export interface DexkitProviderProps {
  theme: {
    cssVarPrefix?: string | undefined;
    colorSchemes: Record<SupportedColorScheme, Record<string, any>>;
  };

  locale: string;
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
  currencyUserAtom: PrimitiveAtom<string>;
  selectedWalletAtom: PrimitiveAtom<string>;
}

export function DexkitProvider({
  children,
  theme,
  currencyUserAtom,
  selectedWalletAtom,
  transactionsAtom,
  locale,
  tokensAtom,
  assetsAtom,
  onChangeLocale,
  localeMessages,
  notificationTypes,
  notificationsAtom,
  userEventsURL,
  siteId,
}: DexkitProviderProps) {
  const connectors = useOrderedConnectors({ selectedWalletAtom });

  const web3ReactKey = useMemo(
    () =>
      connectors.map((connector) => getConnectorName(connector[0])).join("-"),
    [connectors]
  );

  const appState = useDexkitContextState({
    notificationTypes,
    notificationsAtom,
    tokensAtom,
    assetsAtom,
    transactionsAtom,
    currencyUserAtom,
    onChangeLocale,
  });

  return (
    <DexKitContext.Provider
      value={{ ...appState, userEventURL: userEventsURL, siteId: siteId }}
    >
      <IntlProvider
        locale={locale}
        defaultLocale={locale}
        messages={localeMessages}
      >
        <Web3ReactProvider connectors={connectors} key={web3ReactKey}>
          <CssVarsProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <CssBaseline />
              <MagicStateProvider currency="usd">{children}</MagicStateProvider>
              <TransactionUpdater pendingTransactionsAtom={transactionsAtom} />
            </SnackbarProvider>
          </CssVarsProvider>
        </Web3ReactProvider>
      </IntlProvider>
    </DexKitContext.Provider>
  );
}
