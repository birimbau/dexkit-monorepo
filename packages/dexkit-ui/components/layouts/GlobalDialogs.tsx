import { useRouter } from "next/router";

import {
  useHoldsKitDialog,
  useShowSelectCurrency,
  useShowSelectLocale,
  useSignMessageDialog,
  useSwitchNetwork,
} from "@dexkit/ui/hooks";
import dynamic from "next/dynamic";

const SignMessageDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SignMessageDialog")
);
const SwitchNetworkDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SwitchNetworkDialog")
);

import { useDexKitContext, useExecuteTransactionsDialog } from "@dexkit/ui";

const WatchTransactionDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/WatchTransactionDialog")
);
const AppTransactionWatchDialog = dynamic(
  () => import("@dexkit/ui/components/AppTransactionWatchDialog")
);

const HoldingKitDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/HoldingKitDialog")
);

const SelectCurrencyDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SelectCurrencyDialog")
);
const SelectLanguageDialog = dynamic(
  () => import("@dexkit/ui/components/dialogs/SelectLanguageDialog")
);

export function GlobalDialogs() {
  const router = useRouter();

  const { watchTransactionDialog } = useDexKitContext();

  const holdsKitDialog = useHoldsKitDialog();

  const switchNetwork = useSwitchNetwork();

  const showSelectCurrency = useShowSelectCurrency();

  const showSelectLocale = useShowSelectLocale();

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

  const txDialog = useExecuteTransactionsDialog();

  return (
    <>
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
      {holdsKitDialog && (
        <HoldingKitDialog
          dialogProps={{
            open: holdsKitDialog.isOpen,
            onClose: () => holdsKitDialog.setIsOpen(false),
            fullWidth: true,
            maxWidth: "xs",
          }}
        />
      )}

      {showSelectLocale && (
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
}
