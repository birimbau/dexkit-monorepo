import { AppDialogTitle } from '@dexkit/ui';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
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
  section: AppPageSection;
  onConfirm: (name: string) => void;
}

export default function CloneSectionDialog({
  DialogProps,
  section,
  onConfirm,
}: CloneSectionDialogProps) {
  const [name, setName] = useState('');

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
            id="clone.section"
            defaultMessage="Clone Section: {section}"
            values={{ section: section.title }}
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ py: 4 }}>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          label={
            <FormattedMessage id="section.name" defaultMessage="Section name" />
          }
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(name)} variant="contained">
          <FormattedMessage id="clone.section" defaultMessage="Clone Section" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
