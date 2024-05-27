import { AppPage } from '@dexkit/ui/modules/wizard/types/config';
import { Box, Card, IconButton, Link, Stack, Tooltip } from '@mui/material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Visibility from '@mui/icons-material/Visibility';
import { FormattedMessage } from 'react-intl';

export interface PageProps {
  page: AppPage;
  pageKey: string;
  onSelect: () => void;
  onPreview: () => void;
  onClone: () => void;
}

export default function Page({
  page,
  onSelect,
  onPreview,
  onClone,
  pageKey,
}: PageProps) {
  return (
    <Card variant="elevation">
      <Box sx={{ px: 2, py: 1 }}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction="row"
        >
          <Stack alignItems="center" direction="row" spacing={1}>
            <Link
              variant="body1"
              color="text.primary"
              underline="hover"
              sx={{ cursor: 'pointer' }}
              onClick={onSelect}
            >
              {page.title}
            </Link>
            <KeyboardArrowRightIcon color="primary" />
          </Stack>
          <Stack
            alignItems="center"
            justifyContent="center"
            direction="row"
            spacing={1}
          >
            <IconButton onClick={onPreview}>
              <Visibility />
            </IconButton>
            <IconButton onClick={onClone}>
              <Tooltip
                title={<FormattedMessage id="clone" defaultMessage="Clone" />}
              >
                <ContentCopyIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              LinkComponent={Link}
              href={`/${pageKey}`}
              target="_blank"
            >
              <Tooltip
                title={<FormattedMessage id="open" defaultMessage="Open" />}
              >
                <OpenInNewIcon />
              </Tooltip>
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
