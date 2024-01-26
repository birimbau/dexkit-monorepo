import { Box, NoSsr } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo } from "react";

import { Footer } from "../Footer";
import Navbar from "../Navbar";
const SignMessageDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SignMessageDialog")
);
const SwitchNetworkDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SwitchNetworkDialog")
);

import { useWalletActivate } from "@dexkit/wallet-connectors/hooks";
import { useRouter } from "next/router";

import {
  useAppConfig,
  useAppNFT,
  useConnectWalletDialog,
  useDexKitContext,
  useDrawerIsOpen,
  useHoldsKitDialog,
  useShowSelectCurrency,
  useShowSelectLocale,
  useSignMessageDialog,
  useSwitchNetwork,
} from "@dexkit/ui";
import ConnectWalletDialog from "@dexkit/ui/components/ConnectWalletDialog";
import WatchTransactionDialog from "@dexkit/ui/components/dialogs/WatchTransactionDialog";
import { useNetworkMetadata } from "@dexkit/ui/hooks/app";
import { selectedWalletAtom } from "@dexkit/ui/state";
import { AppConfig } from "@dexkit/ui/types/config";
import { WalletActivateParams } from "@dexkit/wallet-connectors/types";
import AppDrawer from "../AppDrawer";

const HoldingKitDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/HoldingKitDialog")
);

const SelectCurrencyDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SelectCurrencyDialog")
);
const SelectLanguageDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SelectLanguageDialog")
);

interface Props {
  children?: JSX.Element;
  noSsr?: boolean;
  disablePadding?: boolean;
  appConfigProps?: AppConfig;
  isPreview?: boolean;
}

const MainLayout: React.FC<Props> = ({
  children,
  noSsr,
  disablePadding,
  appConfigProps,
  isPreview,
}) => {
  const { connector, isActive, isActivating } = useWeb3React();
  const router = useRouter();

  const defaultAppConfig = useAppConfig();
  const appNFT = useAppNFT();
  const appConfig = useMemo(() => {
    if (appConfigProps) {
      return appConfigProps;
    } else {
      return defaultAppConfig;
    }
  }, [defaultAppConfig, appConfigProps]);

  const { watchTransactionDialog } = useDexKitContext();

  const holdsKitDialog = useHoldsKitDialog();

  const switchNetwork = useSwitchNetwork();

  const showSelectCurrency = useShowSelectCurrency();

  const showSelectLocale = useShowSelectLocale();

  const connectWalletDialog = useConnectWalletDialog();

  const handleCloseConnectWalletDialog = () => {
    connectWalletDialog.setOpen(false);
  };

  const handleCloseTransactionDialog = () => {
    if (watchTransactionDialog.redirectUrl) {
      router.replace(watchTransactionDialog.redirectUrl);
    }
    watchTransactionDialog.setRedirectUrl(undefined);
    watchTransactionDialog.setDialogIsOpen(false);
    watchTransactionDialog.setHash(undefined);
    watchTransactionDialog.setType(undefined);
    watchTransactionDialog.setMetadata(undefined);
    watchTransactionDialog.setError(undefined);
  };

  const handleCloseSwitchNetworkDialog = () => {
    switchNetwork.setNetworkChainId(undefined);
    switchNetwork.setOpenSwitchNetwork(false);
  };

  const signMessageDialog = useSignMessageDialog();

  const handleCloseSignMessageDialog = () => {
    signMessageDialog.setOpen(false);
    signMessageDialog.setError(undefined);
    signMessageDialog.setIsSuccess(false);
    signMessageDialog.setMessage(undefined);
  };

  const handleCloseCurrencySelect = () => {
    showSelectCurrency.setIsOpen(false);
  };

  const handleCloseLocaleSelect = () => {
    showSelectLocale.setIsOpen(false);
  };

  const { NETWORKS } = useNetworkMetadata();

  const walletActivate = useWalletActivate({
    magicRedirectUrl:
      typeof window !== "undefined"
        ? window.location.href
        : process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || "",
    selectedWalletAtom,
    NETWORKS,
  });

  const handleActivateWallet = async (params: WalletActivateParams) => {
    await walletActivate.mutation.mutateAsync(params);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      // connector.activate();
      const handleNetworkChange = (newNetwork: any, oldNetwork: any) => {
        if (connector && connector.connectEagerly) {
          connector.connectEagerly();
        }

        // When a Provider makes its initial connection, it emits a "network"
        // event with a null oldNetwork along with the newNetwork. So, if the
        // oldNetwork exists, it represents a changing network
        //window.location.reload();
      };

      if (connector?.provider?.on) {
        connector?.provider?.on("chainChanged", handleNetworkChange);
      }

      return () => {
        if (connector?.provider?.removeListener) {
          connector?.provider?.removeListener(
            "chainChanged",
            handleNetworkChange
          );
        }
      };
    }
  }, [connector, connector?.provider]);

  useEffect(() => {
    if (typeof window !== "undefined" && connector) {
      if (connector.connectEagerly) {
        connector.connectEagerly();
      }
    }
  }, [connector]);

  const isDrawerOpen = useDrawerIsOpen();

  const handleCloseDrawer = () => isDrawerOpen.setIsOpen(false);

  const render = () => (
    <>
      <AppDrawer open={isDrawerOpen.isOpen} onClose={handleCloseDrawer} />
      {showSelectCurrency && (
        <SelectCurrencyDialog
          dialogProps={{
            open: showSelectCurrency.isOpen,
            onClose: handleCloseCurrencySelect,
            fullWidth: true,
            maxWidth: "xs",
          }}
        />
      )}
      {holdsKitDialog.isOpen && (
        <HoldingKitDialog
          dialogProps={{
            open: holdsKitDialog.isOpen,
            onClose: () => holdsKitDialog.setIsOpen(false),
            fullWidth: true,
            maxWidth: "xs",
          }}
        />
      )}

      {showSelectLocale.isOpen && (
        <SelectLanguageDialog
          dialogProps={{
            open: showSelectLocale.isOpen,
            onClose: handleCloseLocaleSelect,
            fullWidth: true,
            maxWidth: "xs",
          }}
        />
      )}
      {watchTransactionDialog.isOpen && (
        <WatchTransactionDialog
          DialogProps={{
            open: watchTransactionDialog.isOpen,
            onClose: handleCloseTransactionDialog,
            fullWidth: true,
            maxWidth: "xs",
          }}
          error={watchTransactionDialog.error}
          hash={watchTransactionDialog.hash}
          type={watchTransactionDialog.type}
          values={watchTransactionDialog.values}
        />
      )}
      {signMessageDialog.open && (
        <SignMessageDialog
          dialogProps={{
            open: signMessageDialog.open,
            onClose: handleCloseSignMessageDialog,
            fullWidth: true,
            maxWidth: "xs",
          }}
          error={signMessageDialog.error}
          success={signMessageDialog.isSuccess}
          message={signMessageDialog.message}
        />
      )}
      {switchNetwork.isOpenSwitchNetwork && (
        <SwitchNetworkDialog
          dialogProps={{
            open: switchNetwork.isOpenSwitchNetwork,
            onClose: handleCloseSwitchNetworkDialog,
            fullWidth: true,
            maxWidth: "xs",
          }}
          chainId={switchNetwork.networkChainId}
        />
      )}
      {connectWalletDialog.isOpen && (
        <ConnectWalletDialog
          DialogProps={{
            open: connectWalletDialog.isOpen || isActivating,
            onClose: handleCloseConnectWalletDialog,
            fullWidth: true,
            maxWidth: "sm",
          }}
          isActive={isActive}
          isActivating={walletActivate.mutation.isLoading || isActivating}
          activeConnectorName={walletActivate.connectorName}
          activate={handleActivateWallet}
        />
      )}
      <Box
        style={{
          minHeight: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar appConfig={appConfig} isPreview={isPreview} />
        <Box sx={{ flex: 1 }} py={disablePadding ? 0 : 4}>
          {children}
        </Box>
        <Footer appConfig={appConfig} isPreview={isPreview} appNFT={appNFT} />
      </Box>
    </>
  );

  if (noSsr) {
    return <NoSsr>{render()}</NoSsr>;
  }

  return render();
};

export default MainLayout;
