import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import ProductsTable from '@/modules/commerce/components/ProductsTable';
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import LazyTextField from '@dexkit/ui/components/LazyTextField';
import Add from '@mui/icons-material/Add';
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
        <Box mb={4}>
          <Typography variant="h5" fontWeight="bold">
            <FormattedMessage id="items" defaultMessage="Items" />
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <FormattedMessage
              id="create.and.manage.your.products"
              defaultMessage="Create and manage your products."
            />
          </Typography>
        </Box>
        <Stack spacing={2} alignItems="flex-start">
          <Button
            LinkComponent={NextLink}
            startIcon={<Add />}
            variant="contained"
            href="/u/account/commerce/products/create"
          >
            <FormattedMessage id="new.product" defaultMessage="New product" />
          </Button>
          <Alert severity="info">
            <FormattedMessage
              id="product.inactive.not.display.info"
              defaultMessage={`Products with the status "Inactive" will not be displayed in your e-commerce store.`}
            />
          </Alert>
        </Stack>
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
        <ProductsTable query={query} />
      </Stack>
    </DashboardLayout>
  );
}
