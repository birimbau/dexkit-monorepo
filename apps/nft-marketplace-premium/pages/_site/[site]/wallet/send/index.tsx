import SendContainer from '@/modules/wallet/components/containers/SendContainer';
import { dexkitNFTapi } from '@dexkit/ui/constants/api';
import { netToQuery } from '@dexkit/ui/utils/networks';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import type { GetStaticProps, GetStaticPropsContext, NextPage } from 'next';

import MainLayout from 'src/components/layouts/main';
import { getAppConfig } from 'src/services/app';

const Send: NextPage = () => {
  return <SendContainer />;
};

type Params = {
  site?: string;
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: GetStaticPropsContext<Params>) => {
  if (params !== undefined) {
    const { site } = params;

    const configResponse = await getAppConfig(site, '');

    const queryClient = new QueryClient();

    await netToQuery({
      instance: dexkitNFTapi,
      queryClient,
      siteId: configResponse.siteId,
    });

    return {
      props: { ...configResponse, dehydratedState: dehydrate(queryClient) },
    };
  }

  return {
    props: {},
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking', // false or 'blocking'
  };
}

(Send as any).getLayout = function getLayout(page: any) {
  return <MainLayout noSsr>{page}</MainLayout>;
};

export default Send;
