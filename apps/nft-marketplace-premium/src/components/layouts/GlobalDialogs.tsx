import { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useSignMessageDialog } from '../../hooks/app';

import { useConnectWalletDialog } from '@dexkit/ui/hooks';
import dynamic from 'next/dynamic';
import {
  holdsKitDialogAtom,
  selectedWalletAtom,
  showSelectCurrencyAtom,
  showSelectLocaleAtom,
  switchNetworkChainIdAtom,
  switchNetworkOpenAtom,
} from '../../state/atoms';

const SignMessageDialog = dynamic(() => import('../dialogs/SignMessageDialog'));
const SwitchNetworkDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/SwitchNetworkDialog'),
);

import { useDexKitContext, useExecuteTransactionsDialog } from '@dexkit/ui';
import { useWalletActivate } from '@dexkit/wallet-connectors/hooks/wallet';
import { WalletActivateParams } from '@dexkit/wallet-connectors/types';

const ConnectWalletDialog = dynamic(
  () => import('@dexkit/ui/components/ConnectWallet/ConnectWalletDialog'),
);
const WatchTransactionDialog = dynamic(
  () => import('@dexkit/ui/components/dialogs/WatchTransactionDialog'),
);
const AppTransactionWatchDialog = dynamic(
  () => import('@dexkit/ui/components/AppTransactionWatchDialog'),
);

const HoldingKitDialog = dynamic(() => import('../dialogs/HoldingKitDialog'));

const SelectCurrencyDialog = dynamic(
  () => import('../dialogs/SelectCurrencyDialog'),
);
const SelectLanguageDialog = dynamic(
  () => import('../dialogs/SelectLanguageDialog'),
);

export function GlobalDialogs() {
  const { connector, isActive, isActivating } = useWeb3React();
  const router = useRouter();

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
            handleNetworkChange,
          );
        }
      };
    }
  }, [connector, connector?.provider]);

  useEffect(() => {
    if (typeof window !== 'undefined' && connector) {
      if (connector.connectEagerly) {
        connector.connectEagerly();
      }
    }
  }, [connector]);

  const { watchTransactionDialog } = useDexKitContext();

  const [holdsKitDialog, setHoldsKitDialog] = useAtom(holdsKitDialogAtom);

  const [switchOpen, setSwitchOpen] = useAtom(switchNetworkOpenAtom);
  const [switchChainId, setSwitchChainId] = useAtom(switchNetworkChainIdAtom);

  const [showSelectCurrency, setShowShowSelectCurrency] = useAtom(
    showSelectCurrencyAtom,
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

  const txDialog = useExecuteTransactionsDialog();
  const walletActivate = useWalletActivate({
    magicRedirectUrl:
      typeof window !== 'undefined'
        ? window.location.href
        : process.env.NEXT_PUBLIC_MAGIC_REDIRECT_URL || '',
    selectedWalletAtom,
  });

  const handleActivateWallet = async (params: WalletActivateParams) => {
    await walletActivate.mutation.mutateAsync(params);
  };

  return (
    <>
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
      {connectWalletDialog.isOpen && (
        <ConnectWalletDialog
          DialogProps={{
            open: connectWalletDialog.isOpen || isActivating,
            onClose: handleCloseConnectWalletDialog,
            fullWidth: true,
            maxWidth: 'sm',
          }}
          isActive={isActive}
          isActivating={walletActivate.mutation.isLoading || isActivating}
          activeConnectorName={walletActivate.connectorName}
          activate={handleActivateWallet}
        />
      )}
      {txDialog.show && (
        <AppTransactionWatchDialog
          DialogProps={{
            open: true,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: txDialog.handleClose,
          }}
          transactions={txDialog.transactions}
        />
      )}
    </>
  );
}
