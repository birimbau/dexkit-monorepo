import { DexkitApiProvider } from '@dexkit/core/providers';
import { myAppsApi } from '@dexkit/ui/constants/api';
import { Container, Grid, useTheme } from '@mui/material';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import MDEditor from '@uiw/react-md-editor';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';

import '@uiw/react-markdown-preview/markdown.css';

import '@uiw/react-md-editor/markdown-editor.css';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import useProductContent from '@dexkit/ui/modules/commerce/hooks/useProductContent';
import { FormattedMessage } from 'react-intl';

export interface ProductContentPageProps {
  orderId: string;
  productId: string;
}

export default function ProductContentPage({
  orderId,
  productId,
}: ProductContentPageProps) {
  const { data: content } = useProductContent({ orderId, productId });

  const theme = useTheme();

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PageHeader
            breadcrumbs={[
              {
                caption: (
                  <FormattedMessage id="my.orders" defaultMessage="My Orders" />
                ),
                uri: '/c/orders',
              },
              {
                caption: orderId.substring(10),
                uri: `/c/orders/${orderId}`,
              },
              {
                caption: (
                  <FormattedMessage
                    id="product.content"
                    defaultMessage="Product content"
                  />
                ),
                uri: `/c/content/${orderId}/${productId}`,
                active: true,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <MDEditor.Markdown
            source={content?.content ?? ''}
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              padding: theme.spacing(4),
              borderRadius: theme.shape.borderRadius,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

(ProductContentPage as any).getLayout = function getLayout(page: any) {
  return (
    <AuthMainLayout noSsr>
      <DexkitApiProvider.Provider value={{ instance: myAppsApi }}>
        {page}
      </DexkitApiProvider.Provider>
    </AuthMainLayout>
  );
};

type Params = {
  site?: string;
  orderId?: string;
  productId?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();

  const configResponse = await getAppConfig(params?.site, 'home');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
      orderId: params?.orderId,
      productId: params?.productId,
    },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths<
  Params
> = ({}: GetStaticPathsContext) => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
