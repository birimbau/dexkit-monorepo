import CheckoutsTable from '@/modules/commerce/components/CheckoutsTable';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Button, InputAdornment, Stack, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import ShareDialog from '@dexkit/ui/components/dialogs/ShareDialog';
import Search from '@mui/icons-material/Search';
import NextLink from 'next/link';
import { useState } from 'react';

export default function CommerceCategoriesPage() {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const { formatMessage } = useIntl();

  const [url, setUrl] = useState<string>();

  const handleShare = (url: string) => {
    setUrl(url);
  };

  const handleClose = () => {
    setUrl(undefined);
  };

  return (
    <>
      {url && (
        <ShareDialog
          url={url}
          dialogProps={{
            open: true,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleClose,
          }}
        />
      )}

      <DashboardLayout page="checkouts">
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
                  <FormattedMessage
                    id="Categories"
                    defaultMessage="Categories"
                  />
                ),
                uri: '/u/account/commerce/categories',
                active: true,
              },
            ]}
          />
          <Typography variant="h6">
            <FormattedMessage id="categories" defaultMessage="Categories" />
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              LinkComponent={NextLink}
              href="/u/account/commerce/categories/create"
              variant="contained"
            >
              <FormattedMessage id="create" defaultMessage="Create" />
            </Button>
            <LazyTextField
              TextFieldProps={{
                size: 'small',
                variant: 'standard',
                placeholder: formatMessage({
                  id: 'search.for.a.checkout',
                  defaultMessage: 'Search for a category',
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
          <CheckoutsTable query={query} onShare={handleShare} />
        </Stack>{' '}
      </DashboardLayout>
    </>
  );
}
