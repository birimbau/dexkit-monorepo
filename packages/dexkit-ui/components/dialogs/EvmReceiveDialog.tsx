import { EvmCoin } from "@dexkit/core/types";

import { Dialog, DialogContent, DialogProps, Divider } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useNetworkMetadata } from "../../hooks/app";
import { AppDialogTitle } from "../AppDialogTitle";
import EvmReceive from "../EvmReceive";

interface Props {
  dialogProps: DialogProps;
  receiver?: string;
  ENSName?: string;
  chainId?: number;
  defaultCoin?: EvmCoin;
  coins?: EvmCoin[];
}

export default function EvmReceiveDialog({
  dialogProps,
  receiver,
  chainId,
  coins,
  ENSName,
  defaultCoin,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const { NETWORK_NAME } = useNetworkMetadata();

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="receive.on.network.value"
            defaultMessage="Receive on {network}"
            values={{
              network: NETWORK_NAME(chainId),
            }}
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <EvmReceive
          receiver={receiver}
          chainId={chainId}
          coins={coins}
          defaultCoin={defaultCoin}
          ENSName={ENSName}
        ></EvmReceive>
      </DialogContent>
    </Dialog>
  );
}
