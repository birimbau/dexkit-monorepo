import type { AppProps } from "next/app";

import { getConnectorName } from "@dexkit/core/utils";
import { useOrderedConnectors } from "@dexkit/ui/hooks";
import { ThemeProvider, createTheme } from "@mui/material";
import Button from "@mui/material/Button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { IntlProvider } from "react-intl";

import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { atom } from "jotai";

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
    }
  }, [connector]);

  return <Button onClick={() => connector.connectEagerly!()}>Connect</Button>;
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
        <Web3ReactProvider key={web3ReactKey} connectors={connectors}>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </Web3ReactProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}
