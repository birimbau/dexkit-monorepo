import { Box, Divider, Grid, Stack, Typography } from '@mui/material';

import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
const ZrxForm = dynamic(() => import('./IntegrationsWizardContainer/ZrxForm'));

export interface IntegrationsWizardContainerProps {
  siteId?: number;
}

export default function RankingWizardContainer({
  siteId,
}: IntegrationsWizardContainerProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack>
            <Typography variant={'h6'}>
              <FormattedMessage id="rankings" defaultMessage="Rankings" />
            </Typography>
            <Typography variant={'body2'}>
              <FormattedMessage
                id="create.rankings.and.gamify.your.app"
                defaultMessage="Create rankings from your events and gamify your app"
              />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </Box>
  );
}
