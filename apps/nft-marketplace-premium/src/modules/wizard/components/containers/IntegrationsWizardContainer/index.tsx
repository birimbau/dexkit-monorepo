import { Box, Grid } from '@mui/material';

import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
import IntegrationCard from './IntegrationCard';
const ZrxForm = dynamic(() => import('./ZrxForm'));

export interface IntegrationsWizardContainerProps {
  siteId?: number;
}

export default function IntegrationsWizardContainer({
  siteId,
}: IntegrationsWizardContainerProps) {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <IntegrationCard
            title={
              <FormattedMessage id="darkblock" defaultMessage="Darkblock" />
            }
            active
            onActivate={(active: boolean) => {}}
          >
            <ZrxForm />
          </IntegrationCard>
        </Grid>
        <Grid item xs={12}>
          <IntegrationCard
            title={<FormattedMessage id="0x" defaultMessage="0x" />}
            active
            onActivate={(active: boolean) => {}}
          >
            <ZrxForm />
          </IntegrationCard>
        </Grid>
      </Grid>
    </Box>
  );
}
