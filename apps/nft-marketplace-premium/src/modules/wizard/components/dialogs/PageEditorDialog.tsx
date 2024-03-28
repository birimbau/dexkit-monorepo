import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { CustomEditorSection } from '@dexkit/ui/modules/wizard/types/section';
import { BuilderKit } from '../../constants';
import PageEditor from '../pageEditor/PageEditor';
import { AppDialogPageEditorTitle } from './AppDialogPageEditorTitle';

interface Props {
  dialogProps: DialogProps;
  section?: CustomEditorSection;
  initialData?: string | null;
  onSave: (section: CustomEditorSection, index: number) => void;
  index: number;
  builderKit?: BuilderKit;
}

export default function PageEditorDialog({
  dialogProps,
  section,
  index,
  onSave,
  builderKit,
}: Props) {
  const [data, setData] = useState<string | null | undefined>(section?.data);

  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
      setData('null');
    }
  };

  const onChangeEditor = (val: string | null) => {
    setData(val);
  };

  const theme = useTheme();

  return (
    <Dialog {...dialogProps} sx={{ zIndex: 1199 }}>
      <Box sx={{ paddingLeft: 4 }}>
        <AppDialogPageEditorTitle
          section={section}
          onClose={handleClose}
          index={index}
          onSave={onSave}
        />
      </Box>
      <DialogContent>
        <Box sx={{ paddingLeft: 25, paddingRight: 25, paddingTop: 5 }}>
          <PageEditor
            value={data}
            onChange={onChangeEditor}
            builderKit={builderKit}
            theme={theme}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack sx={{ paddingRight: 10 }} direction={'row'} spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onSave({ ...section, type: 'custom', data }, index);
              handleClose();
            }}
          >
            <FormattedMessage id="save.section" defaultMessage="Save section" />
          </Button>
          <Button onClick={handleClose}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
