import {
  Box,
  Button,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { CustomEditorSection } from '../../../../types/config';
import { FormattedMessage } from 'react-intl';
import { useState } from 'react';

interface Props {
  section?: CustomEditorSection;
  onSave?: (section: CustomEditorSection, index: number) => void;
  index?: number;
  onClose?: () => void;
  disableClose?: boolean;
}

export function AppDialogPageEditorTitle({
  section,
  onClose,
  onSave,
  disableClose,
  index,
}: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState<string>();

  return (
    <DialogTitle
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        display: 'flex',
        justifyContent: 'space-between',
        p: 2,
        alignItems: 'center',
        alignContent: 'center',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        alignContent="center"
      >
        {isEditMode ? (
          <>
            <Typography variant="inherit">
              <FormattedMessage
                id="section.editor"
                defaultMessage="Section editor"
              />{' '}
            </Typography>
            <TextField
              id="edit-title"
              variant="standard"
              defaultValue={section?.title || 'Custom Page Editor'}
              onChange={(ev) => setTitle(ev.currentTarget.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                setIsEditMode(false);
                if (onSave && index !== undefined) {
                  onSave(
                    { ...section, title, type: 'custom', data: section?.data },
                    index
                  );
                }
              }}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </>
        ) : (
          <>
            {section?.title ? (
              <Typography variant="inherit">
                <FormattedMessage
                  id="section.editor"
                  defaultMessage="Section editor"
                />{' '}
                : {section?.title}
              </Typography>
            ) : (
              <Typography variant="inherit">
                <FormattedMessage
                  id="section.editor"
                  defaultMessage="Section editor"
                />{' '}
                : {'Custom Page Editor'}
              </Typography>
            )}
            <IconButton aria-label="edit" onClick={() => setIsEditMode(true)}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </Stack>
      {onClose && (
        <IconButton disabled={disableClose} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
}
