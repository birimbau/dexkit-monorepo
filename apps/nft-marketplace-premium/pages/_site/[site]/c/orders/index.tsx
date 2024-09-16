import LazyTextField from '@dexkit/ui/components/LazyTextField';
import { Container, InputAdornment, Stack, Typography } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

import UserOrdersTable from '@/modules/commerce/components/UserOrdersTable';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import CommerceUserLayout from '@dexkit/ui/modules/commerce/components/CommerceUserLayout';
import Search from '@mui/icons-material/Search';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useState } from 'react';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function CommerceOrdersPage() {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const { formatMessage } = useIntl();

  return (
    <Container>
      <Stack spacing={2}>
        <PageHeader
          breadcrumbs={[
            {
              caption: (
                <FormattedMessage id="my.orders" defaultMessage="My Orders" />
              ),
              uri: '/c/orders',
            },
          ]}
        />
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Typography variant="h6">
            <FormattedMessage id="my.orders" defaultMessage="My Orders" />
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
        <UserOrdersTable query={query} />
      </Stack>
    </Container>
  );
}

CommerceOrdersPage.getLayout = (page: any) => {
  return (
    <AuthMainLayout noSsr>
      <CommerceUserLayout>{page}</CommerceUserLayout>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      ...configResponse,
    },
    revalidate: REVALIDATE_PAGE_TIME,
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}
