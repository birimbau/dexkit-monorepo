import { IntlProvider } from "react-intl";

import { Web3ReactProvider } from "@web3-react/core";
import { SnackbarProvider } from "notistack";
import { useMemo } from "react";
import { useOrderedConnectors } from "../hooks";

import { Transaction } from "@dexkit/core/types";
import { getConnectorName } from "@dexkit/core/utils";
import { CssBaseline, Theme, ThemeProvider } from "@mui/material";
import { PrimitiveAtom, Provider } from "jotai";

import TransactionUpdater from "./TransactionUpdater";

export interface DexkitProviderProps {
  theme: Theme;
  locale: string;
  defaultLocale?: string;
  children: React.ReactNode | React.ReactNode[];
  pendingTransactionsAtom: PrimitiveAtom<{
    [hash: string]: Transaction;
  }>;
}

export function DexkitProvider({
  children,
  theme,
  pendingTransactionsAtom,
  locale,
}: DexkitProviderProps) {
  const connectors = useOrderedConnectors();

  const web3ReactKey = useMemo(
    () =>
      connectors.map((connector) => getConnectorName(connector[0])).join("-"),
    [connectors]
  );

  return (
    <Provider>
      <IntlProvider locale={locale} defaultLocale={locale}>
        <Web3ReactProvider connectors={connectors} key={web3ReactKey}>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <CssBaseline />
              {children}
              <TransactionUpdater
                pendingTransactionsAtom={pendingTransactionsAtom}
              />
            </SnackbarProvider>
          </ThemeProvider>
        </Web3ReactProvider>
      </IntlProvider>
    </Provider>
  );
}
