import { MagicTxConfirmDialog } from "./dialogs/MagicTxConfirmDialog";

import { useWeb3React } from "@dexkit/ui/hooks/thirdweb";
import { ReactNode, useCallback, useState } from "react";

import MagicSignDataDialog from "../components/dialogs/MagicSignDataDialog";

import { MagicConnector } from "@dexkit/wallet-connectors/connectors/magic";
import { MagicStateContext } from "../context/MagicStateContext";

interface Props {
  children: ReactNode;
  currency: string;
}

export function MagicStateProvider(props: Props) {
  const { chainId } = useWeb3React();

  const magicConnector: MagicConnector = {} as any;

  const { children, currency } = props;
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  // data for transactions
  const [data, setData] = useState<any>();

  const [showSignDataDialog, setShowSignDataDialog] = useState(false);
  // data for sign data RPC
  const [signData, setSignData] = useState<any>();
  // prefer "Dialog" instead of "Modal"
  const handleShowTransactionModal = useCallback(() => {
    setShowTransactionModal(true);
  }, []);

  const handleShowSignDataDialog = useCallback(() => {
    setShowSignDataDialog(true);
  }, []);

  const resetEvents = useCallback(() => {
    magicConnector.providerWrapper?.eventEmitter.removeAllListeners();

    magicConnector.providerWrapper?.eventEmitter.on("request", (args: any) => {
      setData(args);
      handleShowTransactionModal();
    });

    magicConnector.providerWrapper?.eventEmitter.on("sign", (args: any) => {
      setSignData(args);
      handleShowSignDataDialog();
    });
  }, [handleShowTransactionModal, handleShowSignDataDialog, magicConnector]);

  const handleCloseTransactionModal = useCallback(() => {
    setShowTransactionModal(false);
    setData(undefined);
    resetEvents();
  }, [resetEvents]);

  const handleTransactionConfirm = useCallback(
    (data: any) => {
      if (magicConnector.providerWrapper?.eventEmitter) {
        magicConnector.providerWrapper?.eventEmitter.emit("execute", data);
      }
      setShowTransactionModal(false);
    },
    [magicConnector]
  );

  const handleTransactionCancel = useCallback(() => {
    magicConnector.providerWrapper?.eventEmitter.emit("cancel");
    setShowTransactionModal(false);
  }, [magicConnector]);

  const handleSignConfirm = useCallback(() => {
    magicConnector.providerWrapper?.eventEmitter.emit("sign.confirm");
    setShowSignDataDialog(false);
  }, [magicConnector]);

  const handleSignCancel = useCallback(() => {
    magicConnector.providerWrapper?.eventEmitter.emit("sign.cancel");
    setShowSignDataDialog(false);
  }, [magicConnector]);

  /* useEffect(() => {
    if (chainId && connector instanceof MagicConnector) {
      resetEvents();
      return () => {
        magicConnector.providerWrapper?.eventEmitter.removeAllListeners();
      };
    }
  }, [chainId, magicConnector]);*/

  return (
    <MagicStateContext.Provider
      value={{
        handleSignCancel,
        handleSignConfirm,
        handleTransactionCancel,
        handleShowTransactionModal,
        handleTransactionConfirm,
        handleCloseTransactionModal,
        showSignDataDialog,
        showTransactionModal,
        signData,
        data,
      }}
    >
      {showTransactionModal && (
        <MagicTxConfirmDialog
          dialogProps={{
            open: showTransactionModal,
            fullWidth: true,
            maxWidth: "xs",
          }}
          onCancel={handleTransactionCancel}
          data={data}
          onConfirm={handleTransactionConfirm}
          currency={currency}
        />
      )}
      {showSignDataDialog && (
        <MagicSignDataDialog
          dialogProps={{
            open: showSignDataDialog,
            maxWidth: "xs",
            fullWidth: true,
          }}
          signData={signData}
          onConfirm={handleSignConfirm}
          onCancel={handleSignCancel}
        />
      )}

      {children}
    </MagicStateContext.Provider>
  );
}
