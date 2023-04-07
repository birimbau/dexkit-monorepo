import { Box, NoSsr } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo } from 'react';
import {
  useAppConfig,
  useAppNFT,
  useConnectWalletDialog,
  useSignMessageDialog,
} from '../../hooks/app';
import {
  drawerIsOpenAtom,
  holdsKitDialogAtom,
  selectedWalletAtom,
  showSelectCurrencyAtom,
  showSelectLocaleAtom,
  switchNetworkChainIdAtom,
  switchNetworkOpenAtom,
} from '../../state/atoms';
import { Footer } from '../Footer';
import Navbar from '../Navbar';
const SignMessageDialog = dynamic(() => import('../dialogs/SignMessageDialog'));
const SwitchNetworkDialog = dynamic(
  () => import('../dialogs/SwitchNetworkDialog')
);

import { useRouter } from 'next/router';
import { AppConfig } from 'src/types/config';
import AppDrawer from '../AppDrawer';

import { useWalletActivate } from '@dexkit/core/hooks';
import { WalletActivateParams } from '@dexkit/core/types';
import { useDexKitContext } from '@dexkit/ui';
import ConnectWalletDialog from '@dexkit/ui/components/ConnectWalletDialog';
import WatchTransactionDialog from '@dexkit/ui/components/dialogs/WatchTransactionDialog';

const HoldingKitDialog = dynamic(() => import('../dialogs/HoldingKitDialog'));

const SelectCurrencyDialog = dynamic(
  () => import('../dialogs/SelectCurrencyDialog')
);
const SelectLanguageDialog = dynamic(
  () => import('../dialogs/SelectLanguageDialog')
);

interface Props {
  children?: React.ReactNode | React.ReactNode[];
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

  const [holdsKitDialog, setHoldsKitDialog] = useAtom(holdsKitDialogAtom);

  const [switchOpen, setSwitchOpen] = useAtom(switchNetworkOpenAtom);
  const [switchChainId, setSwitchChainId] = useAtom(switchNetworkChainIdAtom);

  const [showSelectCurrency, setShowShowSelectCurrency] = useAtom(
    showSelectCurrencyAtom
  );

  const [showSelectLocale, setShowShowSelectLocale] =
    useAtom(showSelectLocaleAtom);

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
    setSwitchChainId(undefined);
    setSwitchOpen(false);
  };

  const signMessageDialog = useSignMessageDialog();

  const handleCloseSignMessageDialog = () => {
    signMessageDialog.setOpen(false);
    signMessageDialog.setError(undefined);
    signMessageDialog.setIsSuccess(false);
    signMessageDialog.setMessage(undefined);
  };

  const handleCloseCurrencySelect = () => {
    setShowShowSelectCurrency(false);
  };

  const handleCloseLocaleSelect = () => {
    setShowShowSelectLocale(false);
  };

  const walletActivate = useWalletActivate({
    magicRedirectUrl: process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || '',
    selectedWalletAtom,
  });

  const handleActivateWallet = async (params: WalletActivateParams) => {
    await walletActivate.mutation.mutateAsync(params);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
        connector?.provider?.on('chainChanged', handleNetworkChange);
      }

      return () => {
        if (connector?.provider?.removeListener) {
          connector?.provider?.removeListener(
            'chainChanged',
            handleNetworkChange
          );
        }
      };
    }
  }, [connector, connector?.provider]);

  useEffect(() => {
    if (typeof window !== 'undefined' && connector) {
      if (connector.connectEagerly) {
        console.log(connector);
        connector.connectEagerly();
      }
    }
  }, [connector]);

  const [isDrawerOpen, setIsDrawerOpen] = useAtom(drawerIsOpenAtom);

  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const render = () => (
    <>
      <AppDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />
      {showSelectCurrency && (
        <SelectCurrencyDialog
          dialogProps={{
            open: showSelectCurrency,
            onClose: handleCloseCurrencySelect,
            fullWidth: true,
            maxWidth: 'xs',
          }}
        />
      )}
      {holdsKitDialog && (
        <HoldingKitDialog
          dialogProps={{
            open: holdsKitDialog,
            onClose: () => setHoldsKitDialog(false),
            fullWidth: true,
            maxWidth: 'xs',
          }}
        />
      )}

      {showSelectLocale && (
        <SelectLanguageDialog
          dialogProps={{
            open: showSelectLocale,
            onClose: handleCloseLocaleSelect,
            fullWidth: true,
            maxWidth: 'xs',
          }}
        />
      )}
      {watchTransactionDialog.isOpen && (
        <WatchTransactionDialog
          DialogProps={{
            open: watchTransactionDialog.isOpen,
            onClose: handleCloseTransactionDialog,
            fullWidth: true,
            maxWidth: 'xs',
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
            maxWidth: 'xs',
          }}
          error={signMessageDialog.error}
          success={signMessageDialog.isSuccess}
          message={signMessageDialog.message}
        />
      )}
      {switchOpen && (
        <SwitchNetworkDialog
          dialogProps={{
            open: switchOpen,
            onClose: handleCloseSwitchNetworkDialog,
            fullWidth: true,
            maxWidth: 'xs',
          }}
          chainId={switchChainId}
        />
      )}
      <ConnectWalletDialog
        DialogProps={{
          open: connectWalletDialog.isOpen || isActivating,
          onClose: handleCloseConnectWalletDialog,
          fullWidth: true,
          maxWidth: 'sm',
        }}
        isActive={isActive}
        isActivating={walletActivate.mutation.isLoading}
        activeConnectorName={walletActivate.connectorName}
        activate={handleActivateWallet}
      />
      <Box
        style={{
          minHeight: '100vh',
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
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
