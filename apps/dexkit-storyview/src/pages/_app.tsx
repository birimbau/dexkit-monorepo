import type { AppProps } from "next/app";

import { getConnectorName } from "@dexkit/core/utils";
import {
  useExecuteTransactionsDialog,
  useOrderedConnectors,
} from "@dexkit/ui/hooks";
import { ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { IntlProvider } from "react-intl";

import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { atom } from "jotai";
import { SnackbarProvider } from "notistack";

import AppTransactionWatchDialog from "@dexkit/ui/components/AppTransactionWatchDialog";

const theme = createTheme({
  typography: {
    fontFamily: '"Sora", sans-serif',
  },
  palette: {
    mode: "dark",
    background: {
      default: "#151B22",
      paper: "#0D1017",
    },
    primary: {
      main: "#F9AB74",
    },
  },
});

const ConnectorActivator = () => {
  const { connector } = useWeb3React();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      connector &&
      connector.connectEagerly
    ) {
      connector.connectEagerly();
    }
  }, [connector]);

  return null;
};

const Modals = () => {
  const txDialog = useExecuteTransactionsDialog();

  return (
    <>
      {txDialog.show && (
        <AppTransactionWatchDialog
          DialogProps={{
            open: true,
            maxWidth: "sm",
            fullWidth: true,
            onClose: txDialog.handleClose,
          }}
          transactions={txDialog.transactions}
        />
      )}
    </>
  );
};

const selectedWalletAtom = atom<string>("");
const client = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const connectors = useOrderedConnectors({ selectedWalletAtom });

  const web3ReactKey = useMemo(
    () =>
      connectors.map((connector) => getConnectorName(connector[0])).join("-"),
    [connectors]
  );

  return (
    <IntlProvider locale="en-US" defaultLocale="en-US">
      <QueryClientProvider client={client}>
        <SnackbarProvider>
          <Web3ReactProvider key={web3ReactKey} connectors={connectors}>
            <ConnectorActivator />
            <ThemeProvider theme={theme}>
              <Modals />
              <Component {...pageProps} />
            </ThemeProvider>
          </Web3ReactProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}
