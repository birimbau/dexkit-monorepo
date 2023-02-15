import { Web3ReactProvider } from "@web3-react/core";
import { SnackbarProvider } from "notistack";
import { IntlProvider } from "react-intl";
import ConnectWalletDialog from "./dialogs/ConnectWalletDialog";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useOrderedConnectors, useTransactions } from "../hooks";
import { showConnectWalletAtom, showTransactionsAtom } from "./atoms";

import { ThemeProvider } from "@emotion/react";
import { Theme } from "@mui/material";
import { TransactionStatus } from "../constants/enum";
import { DEFAULT_THEME } from "../constants/theme";
import { getConnectorName } from "../utils";
import { NotificationCallbackParams } from "../widgets/swap/types";
import AppTransactionsDialog from "./dialogs/AppTransactionsDialog";
import Updater from "./Updater";

export interface DexkitContextProviderProps {
  children: ({
    handleNotification,
  }: {
    handleNotification: ({
      title,
      hash,
      chainId,
    }: NotificationCallbackParams) => void;
    handleConnectWallet: () => void;
    handleShowTransactions: () => void;
  }) => React.ReactNode | React.ReactNode[];
  renderDialogs?: () => React.ReactNode | React.ReactNode[];
  locale?: string;
  theme?: Theme;
}

const queryClient = new QueryClient();

export default function DexkitContextProvider({
  children,
  renderDialogs,
  locale,
  theme,
}: DexkitContextProviderProps) {
  const connectors = useOrderedConnectors();

  const [showConnectWallet, setShowConnectWallet] = useAtom(
    showConnectWalletAtom
  );

  const [showTransactions, setShowTransactions] = useAtom(showTransactionsAtom);

  const key = useMemo(
    () =>
      connectors.map((connector) => getConnectorName(connector[0])).join("-"),
    [connectors]
  );

  const handleCloseConnectWallet = () => {
    setShowConnectWallet(false);
  };

  const handleCloseTransactions = () => {
    setShowTransactions(false);
  };

  const { addTransaction } = useTransactions();

  const handleNotification = ({
    chainId,
    hash,
    title,
  }: NotificationCallbackParams) => {
    addTransaction({
      transaction: {
        chainId,
        created: Date.now(),
        hash,
        status: TransactionStatus.Pending,
        title,
      },
    });
  };

  const handleConnectWallet = () => {
    setShowConnectWallet(true);
  };

  const handleShowTransactions = () => {
    setShowTransactions(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider locale={locale ? locale : "en"} defaultLocale="en">
        <ThemeProvider theme={theme ? theme : DEFAULT_THEME}>
          <SnackbarProvider
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            maxSnack={3}
          >
            <Web3ReactProvider connectors={connectors} key={key}>
              <ConnectWalletDialog
                DialogProps={{
                  open: showConnectWallet,
                  maxWidth: "sm",
                  fullWidth: true,
                  onClose: handleCloseConnectWallet,
                }}
              />
              <AppTransactionsDialog
                DialogProps={{
                  open: showTransactions,
                  maxWidth: "sm",
                  fullWidth: true,
                  onClose: handleCloseTransactions,
                }}
              />
              {renderDialogs ? renderDialogs() : null}
              {children({
                handleNotification,
                handleConnectWallet,
                handleShowTransactions,
              })}
              <Updater />
            </Web3ReactProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}
