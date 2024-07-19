import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductsTable from '@/modules/commerce/components/ProductsTable';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Container, Stack } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export default function CommerceProductsPage() {
  return (
    <DashboardLayout page="products">
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
                  <FormattedMessage id="products" defaultMessage="Products" />
                ),
                uri: '/u/account/commerce/products',
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
