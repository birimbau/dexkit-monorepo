import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  LinearProgress,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import AppDialogTitle from "../../../components/AppDialogTitle";
import { ChainId } from "../../../constants/enum";
import { ZeroExQuoteResponse } from "../../../services/zeroex/types";
import SwapFeeSummary from "../SwapFeeSummary";

export interface SwapConfirmDialogProps {
  DialogProps: DialogProps;
  quote?: ZeroExQuoteResponse | null;
  chainId?: ChainId;
  isQuoting?: boolean;
  onConfirm: () => void;
  currency: string;
}

export default function SwapConfirmDialog({
  DialogProps,
  quote,
  isQuoting,
  chainId,
  onConfirm,
  currency,
}: SwapConfirmDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage id="confirm.swap" defaultMessage="Confirm swap" />
        }
        onClose={handleClose}
      />
      {isQuoting ? (
        <LinearProgress color="primary" sx={{ height: "1px" }} />
      ) : (
        <Divider />
      )}
      <DialogContent>
        <SwapFeeSummary quote={quote} chainId={chainId} currency={currency} />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button disabled={isQuoting} onClick={onConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
