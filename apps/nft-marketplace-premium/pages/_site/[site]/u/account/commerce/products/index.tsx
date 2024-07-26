import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductsTable from '@/modules/commerce/components/ProductsTable';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Button, InputAdornment, Stack } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import LazyTextField from '@dexkit/ui/components/LazyTextField';
import Search from '@mui/icons-material/Search';
import NextLink from 'next/link';
import { useState } from 'react';

export default function CommerceProductsPage() {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const { formatMessage } = useIntl();

  return (
    <DashboardLayout page="products">
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

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button LinkComponent={NextLink} variant="contained">
            <FormattedMessage id="create" defaultMessage="Create" />
          </Button>
          <LazyTextField
            TextFieldProps={{
              size: 'small',
              variant: 'standard',
              placeholder: formatMessage({
                id: 'search.for.a.product',
                defaultMessage: 'Search for a product',
              }),
              InputProps: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
            onChange={handleChange}
          />
        </Stack>
        <ProductsTable query={query} />
      </Stack>
    </DashboardLayout>
  );
}
