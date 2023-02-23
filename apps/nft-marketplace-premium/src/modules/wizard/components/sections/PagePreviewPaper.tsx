import { Box, Paper, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { AppPageSection } from '../../../../types/config';
import PreviewPagePlatform from '../PreviewPagePlatform';

interface Props {
  sections: AppPageSection[];
  name: string;
  hideButtons?: boolean;
}

export function PagePreviewPaper({ sections, name, hideButtons }: Props) {
  return (
    <Paper>
      <Box sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          justifyContent="space-between"
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            <FormattedMessage
              id="page.preview.title"
              defaultMessage="{name} page preview"
              values={{ name }}
            />
          </Typography>
        </Stack>
      </Box>
      <Box>
        <PreviewPagePlatform sections={sections} disabled={true} />
      </Box>
    </Paper>
  );
}
