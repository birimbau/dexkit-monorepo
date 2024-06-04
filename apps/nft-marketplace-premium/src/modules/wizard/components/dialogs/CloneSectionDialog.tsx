import { AppDialogTitle } from '@dexkit/ui';
import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface CloneSectionDialogProps {
  DialogProps: DialogProps;
  section: AppPageSection;
  onConfirm: (name: string, page?: string) => void;
  pages: { [key: string]: AppPage };
}

export default function CloneSectionDialog({
  DialogProps,
  section,
  pages,
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

  const [page, setPage] = useState<string>('');

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
        <Stack spacing={2}>
          <FormControl>
            <InputLabel shrink>
              <FormattedMessage id="page" defaultMessage="Page" />
            </InputLabel>
            <Select
              value={page}
              onChange={(e) => setPage(e.target.value)}
              displayEmpty
              notched
              label={<FormattedMessage id="page" defaultMessage="Page" />}
            >
              <MenuItem value="">
                <FormattedMessage
                  id="current.page"
                  defaultMessage="Current page"
                />
              </MenuItem>
              {Object.keys(pages).map((key) => (
                <MenuItem key={key} value={key}>
                  {pages[key].title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={
              <FormattedMessage
                id="section.name"
                defaultMessage="Section name"
              />
            }
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(name, page)} variant="contained">
          <FormattedMessage id="clone.section" defaultMessage="Clone Section" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
