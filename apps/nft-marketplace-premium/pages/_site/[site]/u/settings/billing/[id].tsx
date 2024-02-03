import SettingsLayout from '@/modules/user/componentes/SettingsLayout';
import { useBillingQuery } from '@/modules/user/hooks/payments';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { Card, Container, List } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { getAppConfig } from 'src/services/app';
import { myAppsApi } from 'src/services/whitelabel';

export default function BillingDetail() {
  const router = useRouter();
  const { id } = router.query;

  const billingQuery = useBillingQuery({ id: parseInt(id as string) });

  console.log(billingQuery.data);

  return (
    <Container>
      <SettingsLayout>
        {(tab) => (
          <Card>
            <List></List>
          </Card>
        )}
      </SettingsLayout>
    </Container>
  );
}

(BillingDetail as any).getLayout = function getLayout(page: any) {
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
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  const queryClient = new QueryClient();
  const configResponse = await getAppConfig(params?.site, 'no-page-defined');

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...configResponse,
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
