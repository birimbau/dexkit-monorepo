import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductsTable from '@/modules/commerce/components/ProductsTable';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Container, Stack } from '@mui/material';
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
          <ProductsTable />
        </Stack>
      </Container>
    </DashboardLayout>
  );
}
