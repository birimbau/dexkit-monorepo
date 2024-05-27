import { AppDialogTitle } from '@dexkit/ui';
import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface CloneSectionDialogProps {
  DialogProps: DialogProps;
  page: AppPage;
  onConfirm: (name: string) => void;
}

export default function ClonePageDialog({
  DialogProps,
  page,
  onConfirm,
}: CloneSectionDialogProps) {
  const [name, setName] = useState<string>('');

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }

    setName('');
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="clone.page.page"
            defaultMessage="Clone Page: {page}"
            values={{ page: page.title }}
          />
        }
        onClose={handleClose}
      />
      <DialogContent sx={{ py: 4 }} dividers>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          label={<FormattedMessage id="page.name" defaultMessage="Page Name" />}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(name)} variant="contained">
          <FormattedMessage id="clone.page" defaultMessage="Clone Page" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
