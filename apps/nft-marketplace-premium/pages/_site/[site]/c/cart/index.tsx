import { PageHeader } from '@dexkit/ui/components/PageHeader';
import CommerceContextProvider from '@dexkit/ui/modules/commerce/components/CommerceContextProvider';
import CartContent from '@dexkit/ui/modules/commerce/components/CommerceSection/CartContent';
import CommerceUserLayout from '@dexkit/ui/modules/commerce/components/CommerceUserLayout';
import { Box, Container, Stack } from '@mui/material';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { FormattedMessage } from 'react-intl';
import AuthMainLayout from 'src/components/layouts/authMain';
import { REVALIDATE_PAGE_TIME } from 'src/constants';
import { getAppConfig } from 'src/services/app';

export default function CommerceCartPage() {
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
            {
              caption: <FormattedMessage id="cart" defaultMessage="Cart" />,
              uri: '/c/orders/cart',
              active: true,
            },
          ]}
        />
        <Box>
          <CommerceContextProvider>
            <CartContent disableHeader />
          </CommerceContextProvider>
        </Box>
      </Stack>
    </Container>
  );
}

CommerceCartPage.getLayout = (page: any) => {
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
