import CheckoutGeneralSettingsForm from '@/modules/commerce/components/CheckoutGeneralSettingsForm';
import CheckoutNetworksUpdateForm from '@/modules/commerce/components/CheckoutNetworksUpdateForm';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CommerceProductsPage() {
  return (
    <DashboardLayout page="settings">
      <Container>
        <Stack spacing={2}>
          <PageHeader
            breadcrumbs={[
              {
                caption: (
                  <FormattedMessage id="commerce" defaultMessage="Commerce" />
                ),
                uri: '/u/account/commerce',
              },
              {
                caption: (
                  <FormattedMessage id="settings" defaultMessage="Settings" />
                ),
                uri: '/u/account/commerce/settings',
                active: true,
              },
            ]}
          />
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold">
                  <FormattedMessage
                    id="general.settings"
                    defaultMessage="General Settings"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CheckoutGeneralSettingsForm />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold">
                  <FormattedMessage
                    id="checkout.networks"
                    defaultMessage="Checkout Networks"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CheckoutNetworksUpdateForm />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </DashboardLayout>
  );
}
