import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useRef, useState } from 'react';
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

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleEdit = () => {
    setIsEditTitle(true);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

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
          <TextField
            inputRef={(ref) => (inputRef.current = ref)}
            value={title}
            variant="standard"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            onChange={handleChange}
          />
        ) : (
          <Box>
            <Typography
              variant="h5"
              sx={{
                cursor: 'pointer',
              }}
              onClick={handleEdit}
            >
              {page.title}
            </Typography>
          </Box>
        )}
      </Stack>
      {isEditTitle && (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton size="small" onClick={handleSave}>
            <Check />
          </IconButton>
          <IconButton size="small" onClick={handleCancel}>
            <Close />
          </IconButton>
        </Stack>
      )}

      <Button onClick={onPreview} startIcon={<Visibility />}>
        <FormattedMessage id="preview" defaultMessage="Preview" />
      </Button>
    </Stack>
  );
}
