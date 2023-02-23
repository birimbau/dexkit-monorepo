import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';

import { FormattedMessage } from 'react-intl';
import { AppDialogTitle } from './AppDialogTitle';

interface Props {
  dialogProps: DialogProps;
  onConfirm: () => void;
  title?: React.ReactNode | React.ReactNode[];
  icon?: React.ReactNode | React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[];
}

export default function AppConfirmDialog({
  dialogProps,
  onConfirm,
  children,
  title,
  icon,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
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
        <Button color="primary" variant="contained" onClick={onConfirm}>
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
