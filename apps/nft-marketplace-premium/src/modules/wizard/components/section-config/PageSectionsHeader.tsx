import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Edit from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';

export interface PageSectionsHeaderProps {
  onClose: () => void;
  onPreview: () => void;
  onClone: () => void;
  onEditTitle: (title: string) => void;
  page: AppPage;
}

export default function PageSectionsHeader({
  onClose,
  onPreview,
  onClone,
  onEditTitle,
  page,
}: PageSectionsHeaderProps) {
  const [isEditTitle, setIsEditTitle] = useState(false);

  const handleEdit = () => setIsEditTitle(true);

  const [title, setTitle] = useState(page.title || '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    onEditTitle(title);
    setIsEditTitle(false);
  };

  const handleCancel = () => {
    setIsEditTitle(false);
    setTitle(page.title || '');
  };

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={onClose}>
          <ArrowBack color="primary" />
        </IconButton>

        {isEditTitle ? (
          <TextField value={title} variant="standard" onChange={handleChange} />
        ) : (
          <Box>
            <Typography variant="h5">{page.title}</Typography>
          </Box>
        )}
      </Stack>
      {isEditTitle ? (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton size="small" onClick={handleSave}>
            <Check />
          </IconButton>
          <IconButton size="small" onClick={handleCancel}>
            <Close />
          </IconButton>
        </Stack>
      ) : (
        <IconButton onClick={handleEdit}>
          <Edit />
        </IconButton>
      )}

      <Button onClick={onPreview} startIcon={<Visibility />}>
        <FormattedMessage id="preview" defaultMessage="Preview" />
      </Button>
      <Button onClick={onClone} startIcon={<ContentCopy />}>
        <FormattedMessage id="clone" defaultMessage="Clone" />
      </Button>
    </Stack>
  );
}
