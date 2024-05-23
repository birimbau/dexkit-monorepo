import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import {
  Box,
  Card,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Edit from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Visibility from '@mui/icons-material/Visibility';
import { FormattedMessage } from 'react-intl';

export interface PageProps {
  page: AppPage;
  index: number;
  onSelect: () => void;
  onPreview: () => void;
}

export default function Page({ page, index, onSelect, onPreview }: PageProps) {
  return (
    <Card>
      <Box sx={{ px: 2, py: 1 }}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
        >
          <Typography>{page.title}</Typography>
          <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing={1}
          >
            <IconButton onClick={onPreview}>
              <Visibility />
            </IconButton>
            <IconButton>
              <Tooltip
                title={<FormattedMessage id="clone" defaultMessage="Clone" />}
              >
                <ContentCopyIcon />
              </Tooltip>
            </IconButton>
            <IconButton>
              <Tooltip
                title={<FormattedMessage id="open" defaultMessage="Open" />}
              >
                <OpenInNewIcon />
              </Tooltip>
            </IconButton>
            <IconButton onClick={onSelect}>
              <Edit />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
