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
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface CloneSectionDialogProps {
  DialogProps: DialogProps;
  section: AppPageSection;
  onConfirm: (name: string, page?: string) => void;
  pages: { [key: string]: AppPage };
  page: string;
}

export default function CloneSectionDialog({
  DialogProps,
  section,
  pages,
  page,
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

  const [selectedPage, setPage] = useState(page);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="clone.section.section"
            defaultMessage="Clone Section: {section}"
            values={{
              section: (
                <Typography variant="inherit" component="span" fontWeight="400">
                  {section?.title || section?.name}
                </Typography>
              ),
            }}
          />
        }
        onClose={handleClose}
        titleBox={{ px: 2 }}
      />
      <DialogContent dividers sx={{ p: 4 }}>
        <Stack spacing={2}>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={
              <FormattedMessage
                id="new.section.name"
                defaultMessage="New section name"
              />
            }
            fullWidth
          />
          <FormControl>
            <InputLabel shrink>
              <FormattedMessage
                id="clone.section.to.page"
                defaultMessage="Clone section to Page"
              />
            </InputLabel>
            <Select
              value={selectedPage}
              onChange={(e) => setPage(e.target.value)}
              displayEmpty
              notched
              fullWidth
              label={
                <FormattedMessage
                  id="clone.section.to.page"
                  defaultMessage="Clone section to Page"
                />
              }
            >
              {Object.keys(pages).map((key) => (
                <MenuItem key={key} value={key}>
                  {pages[key].title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button onClick={() => onConfirm(name, page)} variant="contained">
          <FormattedMessage id="clone" defaultMessage="Clone" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
