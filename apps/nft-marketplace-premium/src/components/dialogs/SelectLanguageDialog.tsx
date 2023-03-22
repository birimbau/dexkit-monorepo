import { DexKitContext } from '@dexkit/ui';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Radio,
  Stack,
} from '@mui/material';
import { useAtom } from 'jotai';
import { useContext, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocale } from 'src/hooks/app';
import { LANGUAGES } from '../../constants';
import { localeUserAtom } from '../../state/atoms';
import { Language } from '../../types/app';
import { AppDialogTitle } from '../AppDialogTitle';

interface Props {
  dialogProps: DialogProps;
}

function SelectLanguageDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const { locale } = useLocale();
  const { setLocale } = useContext(DexKitContext);
  const [localeUser, setLocaleUser] = useAtom(localeUserAtom);

  const [selectedLocale, setSelectedLocale] = useState(localeUser || locale);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleSelectLocale = (locale: string) => {
    setSelectedLocale(locale);
  };

  const handleConfirmSelect = () => {
    setLocale(selectedLocale);
    setLocaleUser(selectedLocale);
    handleClose();
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="select.language"
            defaultMessage="Select language"
            description="Select language"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers sx={{ p: 0 }}>
        <Stack spacing={2}>
          <List disablePadding>
            {LANGUAGES.map((c: Language, index: number) => (
              <ListItemButton
                onClick={() => handleSelectLocale(c.locale)}
                selected={c.locale === selectedLocale}
                key={index}
              >
                <ListItemText primary={c.name} />
                <ListItemSecondaryAction>
                  <Radio checked={c.locale === selectedLocale} />
                </ListItemSecondaryAction>
              </ListItemButton>
            ))}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmSelect}
        >
          <FormattedMessage
            id="confirm"
            defaultMessage="Confirm"
            description="Confirm"
          />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage
            id="cancel"
            defaultMessage="Cancel"
            description="Cancel"
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SelectLanguageDialog;
