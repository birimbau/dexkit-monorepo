import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';

import { FormattedMessage } from 'react-intl';

interface Props {
  dialogProps: DialogProps;
  onConfirm: () => void;
}

export default function ConfirmRemoveSectionDialog({
  dialogProps,
  onConfirm,
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
        title={
          <FormattedMessage
            id="remove.section"
            defaultMessage="Remove section"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <FormattedMessage
          id="do.you.want.to.remove.this.section"
          defaultMessage="Do you want to remove this section?"
        />
      </DialogContent>
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
