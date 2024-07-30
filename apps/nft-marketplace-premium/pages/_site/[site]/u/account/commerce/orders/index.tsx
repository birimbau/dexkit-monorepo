import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { InputAdornment, Stack, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import OrdersTable from '@/modules/commerce/components/OrdersTable';
import Search from '@mui/icons-material/Search';
import { useState } from 'react';

export default function CommerceCheckoutsPage() {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const { formatMessage } = useIntl();

  return (
    <DashboardLayout page="orders">
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
              caption: <FormattedMessage id="orders" defaultMessage="Orders" />,
              uri: '/u/account/commerce/orders',
              active: true,
            },
          ]}
        />

        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Typography variant="h6">
            <FormattedMessage id="orders" defaultMessage="Orders" />
          </Typography>
          <LazyTextField
            TextFieldProps={{
              size: 'small',
              variant: 'standard',
              placeholder: formatMessage({
                id: 'search.for.a.product',
                defaultMessage: 'Search for an order',
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
        <OrdersTable query={query} />
      </Stack>
    </DashboardLayout>
  );
}
