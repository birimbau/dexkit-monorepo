import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { Button, InputAdornment, Stack, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import CategoriesTable from '@/modules/commerce/components/CheckoutsCategories';
import Search from '@mui/icons-material/Search';
import { useState } from 'react';

import { GET_CATEGORY_LIST } from '@/modules/commerce/hooks/useCategoryList';
import CreateCategoryFormDialog from '@dexkit/ui/modules/commerce/components/dialogs/CreateCategoryFormDialog';
import { useQueryClient } from '@tanstack/react-query';

export default function CommerceCategoriesPage() {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const { formatMessage } = useIntl();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const queryClient = useQueryClient();

  return (
    <>
      <DashboardLayout page="categories">
        <CreateCategoryFormDialog
          DialogProps={{ open, onClose: handleClose }}
          onRefetch={async () => {
            await queryClient.refetchQueries([GET_CATEGORY_LIST]);
          }}
        />
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
            <Button onClick={handleOpen} variant="contained">
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
          <CategoriesTable query={query} />
        </Stack>{' '}
      </DashboardLayout>
    </>
  );
}
