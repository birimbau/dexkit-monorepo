import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from "@mui/material";

import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "./AppDialogTitle";

interface Props {
  DialogProps: DialogProps;
  onConfirm: () => void;
  title?: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[];
  isConfirming?: boolean;
}

export default function AppConfirmDialog({
  DialogProps,
  onConfirm,
  children,
  title,
  icon,
  isConfirming,
}: Props) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={icon}
        title={
          title ? (
            title
          ) : (
            <FormattedMessage id="confirm" defaultMessage="Confirm" />
          )
        }
        onClose={handleClose}
      />
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button
          startIcon={
            isConfirming && <CircularProgress color="inherit" size="1rem" />
          }
          disabled={isConfirming}
          color="primary"
          variant="contained"
          onClick={onConfirm}
        >
          {isConfirming ? (
            <FormattedMessage id="confirming" defaultMessage="Confirming" />
          ) : (
            <FormattedMessage id="confirm" defaultMessage="Confirm" />
          )}
        </Button>
        <Button disabled={isConfirming} onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
