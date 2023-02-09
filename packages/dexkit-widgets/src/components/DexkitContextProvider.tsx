import { Web3ReactProvider } from "@web3-react/core";
import { SnackbarProvider } from "notistack";
import { IntlProvider } from "react-intl";
import ConnectWalletDialog from "./dialogs/ConnectWalletDialog";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useOrderedConnectors } from "../hooks";
import { showConnectWalletAtom } from "./atoms";

import { ThemeProvider } from "@emotion/react";
import { Theme } from "@mui/material";
import { DEFAULT_THEME } from "../constants/theme";
import { getConnectorName } from "../utils";

export interface DexkitContextProviderProps {
  children: React.ReactNode | React.ReactNode[];
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

  const key = useMemo(
    () =>
      connectors.map((connector) => getConnectorName(connector[0])).join("-"),
    [connectors]
  );

  const handleCloseConnectWallet = () => {
    setShowConnectWallet(false);
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
              {renderDialogs ? renderDialogs() : null}
              {children}
            </Web3ReactProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}
