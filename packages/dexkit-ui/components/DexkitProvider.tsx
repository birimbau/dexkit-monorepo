import { IntlProvider, MessageFormatElement } from "react-intl";

import { Web3ReactProvider } from "@web3-react/core";
import { SnackbarProvider } from "notistack";
import { useMemo } from "react";
import { useDexkitContextState, useOrderedConnectors } from "../hooks";

import { AppTransaction } from "@dexkit/core/types";
import { getConnectorName } from "@dexkit/core/utils";
import { CssBaseline, Theme, ThemeProvider } from "@mui/material";
import { PrimitiveAtom, SetStateAction, WritableAtom } from "jotai";

import { DexKitContext } from "../context/DexKitContext";
import { AppNotification, AppNotificationType } from "../types";
import { MagicStateProvider } from "./MagicStateProvider";
import TransactionUpdater from "./TransactionUpdater";

export interface DexkitProviderProps {
  theme: Theme;
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

  selectedWalletAtom: PrimitiveAtom<string>;
}

export function DexkitProvider({
  children,
  theme,
  selectedWalletAtom,
  transactionsAtom,
  locale,
  onChangeLocale,
  localeMessages,
  notificationTypes,
  notificationsAtom,
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
    transactionsAtom,
    onChangeLocale,
  });

  return (
    <DexKitContext.Provider value={appState}>
      <IntlProvider
        locale={locale}
        defaultLocale={locale}
        messages={localeMessages}
      >
        <Web3ReactProvider connectors={connectors} key={web3ReactKey}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <CssBaseline />
              <MagicStateProvider currency="usd">{children}</MagicStateProvider>
              <TransactionUpdater pendingTransactionsAtom={transactionsAtom} />
            </SnackbarProvider>
          </ThemeProvider>
        </Web3ReactProvider>
      </IntlProvider>
    </DexKitContext.Provider>
  );
}
