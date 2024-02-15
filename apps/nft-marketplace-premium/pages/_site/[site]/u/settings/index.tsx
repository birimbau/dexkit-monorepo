import { Box, Container, Stack } from '@mui/material';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticProps,
  GetStaticPropsContext,
} from 'next';
import { getAppConfig } from 'src/services/app';

import BillingSection from '@/modules/user/componentes/BillingSection';
import PaymentsSection from '@/modules/user/componentes/PaymentsSection';
import SettingsLayout from '@/modules/user/componentes/SettingsLayout';
import { DexkitApiProvider } from '@dexkit/core/providers';
import { useRouter } from 'next/router';
import AuthMainLayout from 'src/components/layouts/authMain';
import { myAppsApi } from 'src/services/whitelabel';

export default function SettingsPage() {
  const router = useRouter();

  const { section } = router.query;

  return (
    <Container>
      <Stack spacing={2}>
        <Box></Box>
        <Box>
          <SettingsLayout tab={section ? (section as string) : 'ai'} shallow>
            {(tab) => (
              <>
                {tab === 'payments' && <PaymentsSection />}
                {/* {tab === 'ai' && <AssitantAISection />} */}
                {tab === 'billing' && <BillingSection />}
              </>
            )}
          </SettingsLayout>
        </Box>
      </Stack>
    </Container>
  );
}

(SettingsPage as any).getLayout = function getLayout(page: any) {
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
