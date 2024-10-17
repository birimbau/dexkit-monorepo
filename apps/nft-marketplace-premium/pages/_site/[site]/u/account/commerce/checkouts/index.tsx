import CheckoutsTable from '@/modules/commerce/components/CheckoutsTable';
import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Button, InputAdornment, Stack, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import ShareDialogV2 from '@dexkit/ui/components/dialogs/ShareDialogV2';
import Search from '@mui/icons-material/Search';
import NextLink from 'next/link';
import { useState } from 'react';

export default function CommerceCheckoutsPage() {
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

  const handleShareContent = (value: string) => {};

  return (
    <>
      {url && (
        <ShareDialogV2
          url={url}
          DialogProps={{
            open: true,
            maxWidth: 'sm',
            fullWidth: true,
            onClose: handleClose,
          }}
          onClick={handleShareContent}
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
                  <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
                ),
                uri: '/u/account/commerce/orders',
                active: true,
              },
            ]}
          />
          <Typography variant="h6">
            <FormattedMessage id="checkouts" defaultMessage="Checkouts" />
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              LinkComponent={NextLink}
              href="/u/account/commerce/checkouts/create"
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
                  defaultMessage: 'Search for a checkout',
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
