import CheckoutsTable from '@/modules/commerce/components/CheckoutsTable';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Container, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CommerceOrdersPage() {
  return (
    <DashboardLayout page="checkouts">
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
                  <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
                ),
                uri: '/u/account/commerce/orders',
                active: true,
              },
            ]}
          />
          <CheckoutsTable />
        </Stack>
      </Container>
    </DashboardLayout>
  );
}
