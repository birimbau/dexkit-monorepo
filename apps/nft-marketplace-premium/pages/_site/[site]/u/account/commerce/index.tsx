import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CommerceHomePage() {
  return (
    <DashboardLayout page="home">
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeader
              breadcrumbs={[
                {
                  caption: (
                    <FormattedMessage id="commerce" defaultMessage="Commerce" />
                  ),
                  uri: '/u/account/commerce',
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage
                    id="total.revenue"
                    defaultMessage="Total Revenue"
                  />
                </Typography>
                <Typography variant="h6">$300.00</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  <FormattedMessage
                    id="total.orders"
                    defaultMessage="Total orders"
                  />
                </Typography>
                <Typography variant="h6">30</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
